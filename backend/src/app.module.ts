import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseAuthGuard } from './auth/supabase-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { DocumentosModule } from './documentos/documentos.module';
import { ClientesModule } from './clientes/clientes.module';
import { ContratosModule } from './contratos/contratos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FuncionariosModule,
    EquipamentosModule,
    DocumentosModule,
    ClientesModule,
    ContratosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
})
export class AppModule {}
