import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { User } from "src/auth/user/user.decorator";
import { PasswordsService } from "./passwords.service";
import { CreatePasswordDto } from "./dto/create.dto";
import { UpdatePasswordDto } from "./dto/update.dto";

@UseGuards(AuthGuard)
@Controller("passwords")
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Get()
  listPasswords(@User() userId: string) {
    return this.passwordsService.list(userId);
  }

  @Get("/:id")
  getPassword(@Param("id") id: string, @User() userId: string) {
    return this.passwordsService.getOne(userId, id);
  }

  @Post()
  addPassword(@Body() data: CreatePasswordDto, @User() userId: string) {
    return this.passwordsService.create(userId, data);
  }

  @Get("/:id/decrypt")
  decryptPass(@Param("id") id: string, @User() userId: string) {
    return this.passwordsService.decrypt(userId, id);
  }

  @Patch("/:id")
  editPassword(
    @Param("id") id: string,
    @Body() data: UpdatePasswordDto,
    @User() userId: string,
  ) {
    return this.passwordsService.edit(userId, id, data);
  }

  @Delete("/:id")
  deletePassword(@Param("id") id: string, @User() userId: string) {
    return this.passwordsService.delete(userId, id);
  }
}
