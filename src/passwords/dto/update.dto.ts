import { PartialType } from "@nestjs/mapped-types";
import { CreatePasswordDto } from "./create.dto";

export class UpdatePasswordDto extends PartialType(CreatePasswordDto) {}
