import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePasswordDto } from "./dto/create.dto";
import { HelpersService } from "src/helpers/helpers.service";
import { UpdatePasswordDto } from "./dto/update.dto";

@Injectable()
export class PasswordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: HelpersService,
  ) {}

  async list(userId: string) {
    return this.prisma.password.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        username: true,
        website: true,
      },
    });
  }

  async getOne(userId: string, passId: string) {
    const pass = await this.prisma.password.findUnique({
      where: {
        id: passId,
        userId,
      },
      select: {
        id: true,
        username: true,
        website: true,
      },
    });

    if (!pass) throw new NotFoundException("Unknown password");

    return pass;
  }

  async create(
    userId: string,
    { username, password, website }: CreatePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const securePass = await this.helpers.encrypt(password, user.password);
    const pass = await this.prisma.password.create({
      data: {
        username,
        password: securePass,
        user: {
          connect: {
            id: userId,
          },
        },
        website,
      },
      select: {
        id: true,
        username: true,
        website: true,
      },
    });

    return pass;
  }

  async decrypt(userId: string, passId: string) {
    const pass = await this.prisma.password.findUnique({
      where: {
        id: passId,
        userId,
      },
      select: {
        password: true,
        user: {
          select: {
            id: true,
            password: true,
          },
        },
      },
    });

    if (!pass) throw new NotFoundException("Unknown password");

    const password = await this.helpers.decrypt(
      pass.password,
      pass.user.password,
    );

    return {
      password,
    };
  }

  async edit(userId: string, passId: string, data: UpdatePasswordDto) {
    const pass = await this.prisma.password.findUnique({
      where: {
        id: passId,
        userId,
      },
      select: {
        id: true,
        user: {
          select: {
            password: true,
          },
        },
      },
    });

    if (!pass) throw new NotFoundException("Unknown password");
    if (Object.keys(data).length === 0)
      throw new BadRequestException("Invalid request body");

    const updatedData = await this.prisma.password.update({
      where: {
        id: pass.id,
      },
      data: {
        username: data.username,
        website: data.website,
        password:
          data.password &&
          (await this.helpers.encrypt(data.password, pass.user.password)),
      },
      select: {
        id: true,
        username: true,
        website: true,
      },
    });

    return updatedData;
  }

  async delete(userId: string, passId: string) {
    const pass = await this.prisma.password.findUnique({
      where: {
        id: passId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!pass) throw new NotFoundException("Unknown password");

    const deletedPass = await this.prisma.password.delete({
      where: {
        id: pass.id,
      },
      select: {
        id: true,
      },
    });

    return deletedPass;
  }
}
