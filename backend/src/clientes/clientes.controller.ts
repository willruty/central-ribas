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
import { ClientesService } from './clientes.service';
import { Prisma } from '@prisma/client';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: Prisma.clientesCreateInput) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.clientesService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
    );
  }

  @Get('ativos')
  findAtivos() {
    return this.clientesService.findAtivos();
  }

  @Get('by-cnpj/:cnpj')
  findByCNPJ(@Param('cnpj') cnpj: string) {
    return this.clientesService.findByCNPJ(cnpj);
  }

  @Get('by-cpf/:cpf')
  findByCPF(@Param('cpf') cpf: string) {
    return this.clientesService.findByCPF(cpf);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: Prisma.clientesUpdateInput,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(id);
  }
}
