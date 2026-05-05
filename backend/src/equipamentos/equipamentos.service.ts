import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EquipamentosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.equipamentosCreateInput) {
    return this.prisma.equipamentos.create({ data });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.equipamentos.findMany({
      skip,
      take,
      include: {
        categorias_equipamento: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.equipamentos.findUnique({
      where: { id },
      include: {
        categorias_equipamento: true,
        documentos: true,
        itens_contrato: true,
        manutencoes: true,
      },
    });
  }

  async update(id: string, data: Prisma.equipamentosUpdateInput) {
    return this.prisma.equipamentos.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.equipamentos.delete({
      where: { id },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.equipamentos.findMany({
      where: { status: status as any },
    });
  }

  async findAtivos() {
    return this.prisma.equipamentos.findMany({
      where: { ativo: true, deleted_at: null },
    });
  }
}
