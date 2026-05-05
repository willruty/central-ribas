import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  FuncionariosService,
  CreateFuncionarioComAcessoDto,
} from './funcionarios.service';
import { Prisma } from '@prisma/client';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Post('register')
  createComAcesso(@Body() dto: CreateFuncionarioComAcessoDto) {
    return this.funcionariosService.createComAcesso(dto);
  }

  @Post()
  create(@Body() createFuncionarioDto: Prisma.funcionariosCreateInput) {
    return this.funcionariosService.create(createFuncionarioDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.funcionariosService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
    );
  }

  @Get('ativos')
  findAtivos() {
    return this.funcionariosService.findAtivos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.funcionariosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFuncionarioDto: Prisma.funcionariosUpdateInput,
  ) {
    return this.funcionariosService.update(id, updateFuncionarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.funcionariosService.remove(id);
  }
}
