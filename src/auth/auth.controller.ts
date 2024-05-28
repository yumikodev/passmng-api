import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signin")
  signIn(@Body() data: AuthDTO) {
    return this.authService.signIn(data);
  }

  @Post("/signup")
  signUp(@Body() data: AuthDTO) {
    return this.authService.signUp(data);
  }
}
