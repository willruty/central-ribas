import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.documentosCreateInput) {
    return this.prisma.documentos.create({ data });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.documentos.findMany({
      skip,
      take,
    });
  }

  async findOne(id: string) {
    return this.prisma.documentos.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.documentosUpdateInput) {
    return this.prisma.documentos.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.documentos.delete({
      where: { id },
    });
  }

  async findByType(tipo: string) {
    return this.prisma.documentos.findMany({
      where: { tipo: tipo as any },
    });
  }

  async findByFuncionario(funcionarioId: string) {
    return this.prisma.documentos.findMany({
      where: { funcionario_id: funcionarioId },
    });
  }

  async findVencidos() {
    return this.prisma.documentos.findMany({
      where: {
        validade: {
          lt: new Date(),
        },
      },
    });
  }

  async findProximoVencimento(dias: number = 30) {
    const hoje = new Date();
    const proximos = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);

    return this.prisma.documentos.findMany({
      where: {
        AND: [
          {
            validade: {
              gte: hoje,
            },
          },
          {
            validade: {
              lte: proximos,
            },
          },
        ],
      },
    });
  }
}
