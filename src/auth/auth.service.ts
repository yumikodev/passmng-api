import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthDTO } from "./dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { compare, genSalt, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signIn({ email, password }: AuthDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || (await compare(password, user.password)))
      throw new BadRequestException("Invalid credentials");

    const token = await this.jwt.signAsync({ userId: user.id });

    return {
      token,
    };
  }

  async signUp({ email, password }: AuthDTO) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) throw new BadRequestException("Taken credentials");

    const salt = await genSalt(10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: await hash(password, salt),
      },
    });

    const token = await this.jwt.signAsync({ userId: user.id });

    return {
      token,
    };
  }
}
