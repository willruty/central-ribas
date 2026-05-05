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
import { EquipamentosService } from './equipamentos.service';
import { Prisma } from '@prisma/client';

@Controller('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
  create(@Body() createEquipamentoDto: Prisma.equipamentosCreateInput) {
    return this.equipamentosService.create(createEquipamentoDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.equipamentosService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
    );
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.equipamentosService.findByStatus(status);
  }

  @Get('ativos')
  findAtivos() {
    return this.equipamentosService.findAtivos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipamentosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEquipamentoDto: Prisma.equipamentosUpdateInput,
  ) {
    return this.equipamentosService.update(id, updateEquipamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipamentosService.remove(id);
  }
}
