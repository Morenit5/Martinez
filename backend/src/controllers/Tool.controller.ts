import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Put, Query, UseInterceptors, ParseFilePipe, UploadedFile, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { ServiceTool } from 'src/services/Tool.service';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { CreateToolDto, ToolDto, UpdateToolDto } from 'src/dto/Tool.dto';
import { Serializer } from 'src/interceptors/UserTransform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

//@Controller('tool')
@Serializer(ToolDto)
@Controller({ version: '1', path: 'tool' })
export class ControllerTool {
  createTool: CreateToolDto;
  updateTool: UpdateToolDto;
  constructor(private readonly serviceTool: ServiceTool, private readonly exceptions: TypeORMExceptions) { }

  /*@Get()
  findAll(pagination: PaginationQueryDto): Promise<ToolDto[]> {
    return this.serviceTool.findAll(pagination);
  }*/

  /*@Get()
  findAll(): Promise<ToolDto[]> {
    return this.serviceTool.findAll();
  }*/

  @Get('/catg')
  findAllWithCategories(): Promise<ToolDto[]> {
    return this.serviceTool.findAllWithCategories().then((result: any) => {
         
          return result;
        }).catch((error: any) => {
            this.exceptions.sendException(error);
        });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ToolDto | null> {

    // puedo eliminar
    //puedo cambiar de categoria
    //deshabilitar la herramienta darle de baja
    return this.serviceTool.findOne(id);
  }

  @Post()
  async create(@Body() tool: CreateToolDto): Promise<ToolDto | null> {

    try {
      this.createTool = tool;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while creating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceTool.create(this.createTool) .then((result: any) => {
       
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: join(__dirname, '..', 'uploads','tools'),
      filename: (req, file, cb) => {
        // Generate a unique filename
        const body =  req.body;
          Object.keys(body).forEach(key => {
      console.log(`Key: ${key}, Value: ${body[key]}`);
         //let xxx = body[key] as CreateToolDto;
         const unknownBody =  body[key]

        //if (typeof unknownBody === 'object' && unknownBody !== null) {
            for (const key of Object.keys( unknownBody)) {
                const value = (unknownBody as Record<string, any>)[key];
                console.log(`Key: ${key}, Value: ${value}`);
            }
        //}
        });
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
    ]
  })) file: Express.Multer.File): Promise<ToolDto | null> {
    console.log('Estamos llegando aqui a la foto')

    try {
      // Simulate an asynchronous file upload API call
      const resp = await new Promise<ToolDto>(async (resolve, reject) => {
        if (file) {
         const av = new ToolDto();
          av.image = file.filename;
          resolve(av);
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

  // este metodo es para actualizar la tool junto con su categoryId
  @Put('/up/:id')
  async update(@Param('id') toolId: string, @Body() tool): Promise<ToolDto | null> {

    
    //buscar por id, nombre, categoria
    try {
      this.updateTool = tool;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal error while updating"
      },
        HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error
      });
    }

    return await this.serviceTool.update(Number(toolId), this.updateTool).then((result: any) => {
        
        return result;
      }).catch((error: any) => {
        this.exceptions.sendException(error);
      });
  }
}