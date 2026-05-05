import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.clientesCreateInput) {
    return this.prisma.clientes.create({ data });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.clientes.findMany({
      skip,
      take,
    });
  }

  async findOne(id: string) {
    return this.prisma.clientes.findUnique({
      where: { id },
      include: {
        contratos: true,
        documentos: true,
      },
    });
  }

  async update(id: string, data: Prisma.clientesUpdateInput) {
    return this.prisma.clientes.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.clientes.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.clientes.findFirst({
      where: { email },
    });
  }

  async findAtivos() {
    return this.prisma.clientes.findMany({
      where: { ativo: true, deleted_at: null },
    });
  }

  async findByCNPJ(cnpj: string) {
    return this.prisma.clientes.findFirst({
      where: { cnpj },
    });
  }

  async findByCPF(cpf: string) {
    return this.prisma.clientes.findFirst({
      where: { cpf },
    });
  }
}
