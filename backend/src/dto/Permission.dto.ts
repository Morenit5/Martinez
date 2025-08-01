import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreateRolDto, RolDto } from './Rol.dto';
import { PartialType } from '@nestjs/mapped-types';

export class PermissionDto {

    @IsOptional()
    @IsNumber()
    permissionId?: number;
    
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsObject()
    rol?: RolDto[]; //@ManyToOne EntityRol, rol => rol.permission, 

}

export class CreatePermissionDto {
    

    @IsNotEmpty({ message: 'El nombre del permiso es obligatorio.' })
    @IsString()
    name: string;

    @IsOptional()
    @IsObject()
    rol?: CreateRolDto[]; //@ManyToOne EntityRol, rol => rol.permission, 
    
    @IsNotEmpty()
    @IsBoolean()
    enabled: boolean;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    
    @IsNotEmpty()
    @IsNumber()
    permissionId: number;

    
}