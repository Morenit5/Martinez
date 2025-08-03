import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEmail, IsOptional, IsString, IsObject, isNotEmpty, IsNumber, IsBoolean, IsPhoneNumber } from 'class-validator';
import { CreateRolDto, RolDto } from './Rol.dto';

export class userDto {

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()  
  lastname?: string;

  @IsOptional()
  @IsObject()
  rol: RolDto; //@OneToOne(() => EntityRol, rol => rol.rolId)

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('US', { message: 'Invalid US phone number' })
  phone?: string;

}

export class CreateUserDto  {
  
  @IsOptional()
  name: string;

  @IsOptional()
  lastname: string;

  @IsObject()
  rol: CreateRolDto; //@OneToOne(() => EntityRol, rol => rol.rolId)

  @IsOptional()
  @IsPhoneNumber('US', { message: 'Invalid US phone number' })
  phone?: string;

  @IsBoolean()
  enabled: boolean;
}

export class CreateUserLoginDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsString()
  username: string;
 
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

}

export class UpdateUserDto extends PartialType(CreateUserLoginDto) {

  @IsNotEmpty()
  @IsNumber()
  userId: number;

}
