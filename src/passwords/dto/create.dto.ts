import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreatePasswordDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUrl()
  @IsOptional()
  website?: string;
}
