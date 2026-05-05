import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContratosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.contratosCreateInput) {
    return this.prisma.contratos.create({ data });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.contratos.findMany({
      skip,
      take,
      include: {
        clientes: true,
        profiles: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.contratos.findUnique({
      where: { id },
      include: {
        clientes: true,
        profiles: true,
        documentos: true,
        itens_contrato: true,
        operacoes: true,
        pagamentos: true,
      },
    });
  }

  async update(id: string, data: Prisma.contratosUpdateInput) {
    return this.prisma.contratos.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.contratos.delete({
      where: { id },
    });
  }

  async findByCliente(clienteId: string) {
    return this.prisma.contratos.findMany({
      where: { cliente_id: clienteId },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.contratos.findMany({
      where: { status: status as any },
    });
  }

  async findAtivos() {
    return this.prisma.contratos.findMany({
      where: {
        status: 'em_execucao',
      },
    });
  }

  async findProximoVencimento(dias: number = 30) {
    const hoje = new Date();
    const proximos = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);

    return this.prisma.contratos.findMany({
      where: {
        AND: [
          {
            data_fim_previsto: {
              gte: hoje,
            },
          },
          {
            data_fim_previsto: {
              lte: proximos,
            },
          },
        ],
      },
    });
  }
}
