import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEmail, IsOptional, IsString, IsObject, isNotEmpty, IsNumber, IsBoolean, IsPhoneNumber } from 'class-validator';
import { CreateRolDto, RolDto } from './Rol.dto';
import { Exclude, Expose } from 'class-transformer';

export class userDto {

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
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()  
  lastname?: string;

  @Expose()
  @IsOptional()
  @IsObject()
  rol: RolDto; //@OneToOne(() => EntityRol, rol => rol.rolId)

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
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
