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
import { DocumentosService } from './documentos.service';
import { Prisma } from '@prisma/client';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  create(@Body() createDocumentoDto: Prisma.documentosCreateInput) {
    return this.documentosService.create(createDocumentoDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.documentosService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
    );
  }

  @Get('type/:tipo')
  findByType(@Param('tipo') tipo: string) {
    return this.documentosService.findByType(tipo);
  }

  @Get('funcionario/:funcionarioId')
  findByFuncionario(@Param('funcionarioId') funcionarioId: string) {
    return this.documentosService.findByFuncionario(funcionarioId);
  }

  @Get('status/vencidos')
  findVencidos() {
    return this.documentosService.findVencidos();
  }

  @Get('status/proximo-vencimento')
  findProximoVencimento(@Query('dias') dias?: string) {
    return this.documentosService.findProximoVencimento(
      dias ? parseInt(dias) : 30,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentoDto: Prisma.documentosUpdateInput,
  ) {
    return this.documentosService.update(id, updateDocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentosService.remove(id);
  }
}
