import { Module } from "@nestjs/common";
import { PasswordsService } from "./passwords.service";
import { PasswordsController } from "./passwords.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { HelpersModule } from "src/helpers/helpers.module";

@Module({
  imports: [PrismaModule, HelpersModule],
  providers: [PasswordsService],
  controllers: [PasswordsController],
})
export class PasswordsModule {}
