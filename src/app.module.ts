import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HelpersModule } from "./helpers/helpers.module";
import { ConfigModule } from "@nestjs/config";
import { PasswordsModule } from "./passwords/passwords.module";
import env from "./config/env";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    HelpersModule,
    PasswordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
