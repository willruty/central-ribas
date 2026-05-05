import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { Prisma, cargo_usuario } from '@prisma/client';

export class CreateFuncionarioComAcessoDto {
  nome: string;
  cargo: string;
  email: string;
  senha: string;
  cargo_sistema?: cargo_usuario;
  cpf?: string;
  telefone?: string;
  celular?: string;
}

@Injectable()
export class FuncionariosService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(data: Prisma.funcionariosCreateInput) {
    return this.prisma.funcionarios.create({ data });
  }

  async createComAcesso(dto: CreateFuncionarioComAcessoDto) {
    // 1. Criar usuário em auth.users (trigger cria o profile automaticamente)
    const authUser = await this.authService.createAuthUser(
      dto.email,
      dto.senha,
      dto.nome,
    );

    // 2. Atualizar profile com nome, cargo e email corretos
    await this.prisma.profiles.update({
      where: { id: authUser.id },
      data: {
        nome: dto.nome,
        cargo: dto.cargo_sistema ?? cargo_usuario.visualizador,
        email: dto.email,
      },
    });

    // 3. Criar funcionario vinculado ao profile
    return this.prisma.funcionarios.create({
      data: {
        nome: dto.nome,
        cargo: dto.cargo,
        email: dto.email,
        cpf: dto.cpf,
        telefone: dto.telefone,
        celular: dto.celular,
        profiles: { connect: { id: authUser.id } },
      },
      include: { profiles: true },
    });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.funcionarios.findMany({
      skip,
      take,
      include: {
        profiles: true,
        documentos: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.funcionarios.findUnique({
      where: { id },
      include: {
        profiles: true,
        documentos: true,
        itens_contrato: true,
        manutencoes: true,
        operacoes: true,
      },
    });
  }

  async update(id: string, data: Prisma.funcionariosUpdateInput) {
    return this.prisma.funcionarios.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.funcionarios.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.funcionarios.findFirst({
      where: { email },
    });
  }

  async findAtivos() {
    return this.prisma.funcionarios.findMany({
      where: { ativo: true, deleted_at: null },
    });
  }
}
