import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { FuncionariosService } from './funcionarios.service';
import { FuncionariosController } from './funcionarios.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FuncionariosController],
  providers: [FuncionariosService],
  exports: [FuncionariosService],
})
export class FuncionariosModule {}
