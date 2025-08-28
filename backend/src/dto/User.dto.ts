import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEmail, IsOptional, IsString, IsObject, isNotEmpty, IsNumber, IsBoolean, IsPhoneNumber } from 'class-validator';
import { CreateRolDto, RolDto } from './Rol.dto';
import { Exclude, Expose, Type } from 'class-transformer';

export class userDto {

  @Expose()
  @IsOptional()
  @IsNumber()
  userId?: number;

  @Expose()
  @IsOptional()
  @IsString()
  username?: string;

  @Exclude()
  @IsOptional()
  @IsString()
  password?: string;

  @Expose()
  @IsOptional()
  @IsString()
  firstname?: string;

  @Expose()
  @IsOptional()
  @IsString()  
  lastname?: string;

  @Expose()
  @IsOptional()
  @IsObject()
  @Type(() => RolDto)
  rol: RolDto; //@OneToOne(() => EntityRol, rol => rol.rolId)

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber('US', { message: 'Invalid US phone number' })
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()  
  avatar?:string;

}

export class CreateUserDto  {
  
  @IsOptional()
  firstname: string;

  @IsOptional()
  lastname: string;

  @IsObject()
  rol: CreateRolDto; //@OneToOne(() => EntityRol, rol => rol.rolId)

  @IsOptional()
  @IsPhoneNumber('US', { message: 'Invalid US phone number' })
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()  
  avatar?:string;

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


