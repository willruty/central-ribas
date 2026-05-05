import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContratosService } from './contratos.service';
import { ContratosController } from './contratos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ContratosController],
  providers: [ContratosService],
  exports: [ContratosService],
})
export class ContratosModule {}
