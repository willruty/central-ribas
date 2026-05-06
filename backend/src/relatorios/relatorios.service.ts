import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async getResumo() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in30d = new Date(today);
    in30d.setDate(in30d.getDate() + 30);

    const [
      equipamentosAtivos,
      equipamentosDisponiveis,
      equipamentosLocados,
      equipamentosEmManutencao,
      documentosTotal,
      documentosVencidos,
      documentosVencendo30d,
      funcionariosAtivos,
      clientesAtivos,
      docsByTipo,
      frotaByStatus,
      contratosByStatus,
    ] = await Promise.all([
      this.prisma.equipamentos.count({ where: { ativo: true, deleted_at: null } }),
      this.prisma.equipamentos.count({ where: { status: 'disponivel' as any, deleted_at: null } }),
      this.prisma.equipamentos.count({ where: { status: 'locado' as any, deleted_at: null } }),
      this.prisma.equipamentos.count({ where: { status: 'em_manutencao' as any, deleted_at: null } }),
      this.prisma.documentos.count(),
      this.prisma.documentos.count({ where: { validade: { lt: today } } }),
      this.prisma.documentos.count({ where: { validade: { gte: today, lte: in30d } } }),
      this.prisma.funcionarios.count({ where: { ativo: true, deleted_at: null } }),
      this.prisma.clientes.count({ where: { ativo: true, deleted_at: null } }),
      this.prisma.documentos.groupBy({ by: ['tipo'], _count: { tipo: true } }),
      this.prisma.equipamentos.groupBy({ by: ['status'], where: { deleted_at: null }, _count: { status: true } }),
      this.prisma.contratos.groupBy({ by: ['status'], _count: { status: true } }),
    ]);

    const documentosOk = documentosTotal - documentosVencidos - documentosVencendo30d;

    return {
      equipamentosAtivos,
      equipamentosDisponiveis,
      equipamentosLocados,
      equipamentosEmManutencao,
      documentosTotal,
      documentosVencidos,
      documentosVencendo30d,
      documentosOk,
      funcionariosAtivos,
      clientesAtivos,
      documentosPorTipo: docsByTipo.map((r) => ({ tipo: r.tipo, total: r._count.tipo })),
      frotaPorStatus: frotaByStatus.map((r) => ({ status: r.status, total: r._count.status })),
      contratosPorStatus: contratosByStatus.map((r) => ({ status: r.status, total: r._count.status })),
    };
  }
}
