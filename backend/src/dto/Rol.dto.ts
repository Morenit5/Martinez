import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreatePermissionDto, PermissionDto } from './Permission.dto';
import { userDto } from './User.dto';
import { PartialType } from '@nestjs/mapped-types';

export class RolDto {

    @Expose()
    @IsOptional()
    @IsNumber()
    rolId: number;
     
    @Expose()
    @IsOptional()
    @IsString()
    name: string;

    @Expose()
    @IsOptional()
    @IsObject()
    @Type(() => userDto)
    user?: userDto;  //@OneToOne(() => EntityUser, user => user.userId)

    @Expose()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PermissionDto)     // Important for nested object validation
    permission?: PermissionDto[];  //@OneToMany(() => EntityPermission, permission => permission.permissionId)

}

export class CreateRolDto {

    @IsNotEmpty({ message: 'El nombre del rol es obligatorio.' })
    @IsString()
    name: string;

    @IsOptional()
    @IsObject()
    user?: userDto;  //@OneToOne(() => EntityUser, user => user.userId)

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreatePermissionDto)     // Important for nested object validation
    permission?: CreatePermissionDto[];  //@OneToMany(() => EntityPermission, permission => permission.permissionId)

    @IsBoolean()
    enabled: boolean;
}

export class UpdateRolDto extends PartialType(CreateRolDto) {
  
    rolId: number;

}