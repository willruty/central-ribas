import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EquipamentosService } from './equipamentos.service';
import { EquipamentosController } from './equipamentos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EquipamentosController],
  providers: [EquipamentosService],
  exports: [EquipamentosService],
})
export class EquipamentosModule {}
