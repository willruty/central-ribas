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
import { ContratosService } from './contratos.service';
import { Prisma } from '@prisma/client';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post()
  create(@Body() createContratoDto: Prisma.contratosCreateInput) {
    return this.contratosService.create(createContratoDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.contratosService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
    );
  }

  @Get('cliente/:clienteId')
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.contratosService.findByCliente(clienteId);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.contratosService.findByStatus(status);
  }

  @Get('ativos')
  findAtivos() {
    return this.contratosService.findAtivos();
  }

  @Get('status/proximo-vencimento')
  findProximoVencimento(@Query('dias') dias?: string) {
    return this.contratosService.findProximoVencimento(
      dias ? parseInt(dias) : 30,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContratoDto: Prisma.contratosUpdateInput,
  ) {
    return this.contratosService.update(id, updateContratoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contratosService.remove(id);
  }
}
