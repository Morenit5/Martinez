import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors, ParseFilePipeBuilder, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { CreateUserDto, CreateUserLoginDto, UpdateUserDto, userDto } from '../dto/User.dto';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { ServiceUser } from '../services/User.service';
import { Serializer } from 'src/interceptors/UserTransform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { join } from 'path';

//@Controller('user')
@Serializer(userDto)
@Controller({ version: '1', path: 'user' })
export class ControllerUser {
  newUser: CreateUserLoginDto;
  updateUser: UpdateUserDto;


  constructor(private readonly serviceUser: ServiceUser, private readonly exceptions: TypeORMExceptions) { }

  @Get()
  findAll(): Promise<userDto[]> {
    return this.serviceUser.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<userDto | null> {
    return this.serviceUser.findOne(+id);
  }

  @Post()
  async create(@Body() user: CreateUserLoginDto): Promise<userDto> {

    try {
      this.newUser = user;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceUser.createFullUser(this.newUser).then((result: any) => {
        return result;
    }).catch((error: any) => {
        this.exceptions.sendException(error);
    });

  }
  
  @Post('/upload')
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: join(__dirname, '..', 'uploads'),
      filename: (req, file, cb) => {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = '.png';
        const userid = file.originalname; //este tiene el valor de user Id
        cb(null, `${userid}_${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
      new FileTypeValidator({ fileType: 'image/png', skipMagicNumbersValidation: true, }), // Validate against the MIME type
    ],
  }),
  ) file: Express.Multer.File): Promise<userDto | null> {
    try {
      // Simulate an asynchronous file upload API call
      const resp = await new Promise<userDto>(async (resolve, reject) => {
        if (file) {
          const userId = file.filename.substring(0, file.filename.indexOf('_'));
          const av = new userDto();
          av.avatar = file.filename;

          this.updateUser = new UpdateUserDto();
          this.updateUser.userId = + userId;
          this.updateUser.avatar = file.filename;

          const success = await this.serviceUser.update(Number(userId), this.updateUser).then((result: any) => {
            console.log("Result:", result);
            return result;
          }).catch((error: any) => {
            this.exceptions.sendException(error);
          });

          if (success) {
            //console.log(`File '${file.filename}' uploaded successfully (async/await).`);
            resolve(av);
          } else {
            //console.error(`Failed to upload file `);
            reject(new Error(`fallo al cargar la foto deseada`));
          }


        } else {
          //console.error(`Failed to upload file `);
          reject(new Error(`fallo al cargar la foto deseada`));
        }

      });
      return resp;
    } catch (error) {
      //console.error('An error occurred during async upload:', error);
      throw error; // Re-throw to propagate the error
    }
  }

  @Get('/images/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(__dirname, '..', 'uploads', filename); // Replace 'uploads' with your actual image storage location
    console.log('este es el path ' + imagePath)
    const fileStream = createReadStream(imagePath);

    fileStream.on('open', () => {
      res.setHeader('Content-Type', 'image/png'); // Adjust content type based on image type
      fileStream.pipe(res);
    });

    fileStream.on('error', (err) => {
      throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "image not found"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: err
        });
    });
  }



  @Put('/up/:id')
  async update(@Param('id') userId: string, @Body() user): Promise<userDto | null> {
  
      //buscar por id, nombre, categoria
      try {
        this.updateUser = user;
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal error while updating"
        },
          HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: error
        });
      }
  
      return await this.serviceUser.update(Number(userId), this.updateUser).then((result: any) => {
          console.log("Result:", result);
          return result;
        }).catch((error: any) => {
          this.exceptions.sendException(error);
        });
    }

  /*@Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.serviceUser.delete(+id);
  }*/
}