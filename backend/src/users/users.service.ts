import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.usersCreateInput) {
    return this.prisma.users.create({ data });
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
      include: { profiles: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Prisma.usersUpdateInput) {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
