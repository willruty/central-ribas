import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      this.config.getOrThrow<string>('SUPABASE_URL'),
      this.config.getOrThrow<string>('SUPABASE_ANON_KEY'),
    );
    this.supabaseAdmin = createClient(
      this.config.getOrThrow<string>('SUPABASE_URL'),
      this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 400 || error.code === 'invalid_credentials') {
        throw new UnauthorizedException('Email ou senha incorretos');
      }
      throw new InternalServerErrorException(
        'Erro ao autenticar. Tente novamente.',
      );
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
      },
    };
  }

  async logout(token: string) {
    await this.supabaseAdmin.auth.admin.signOut(token, 'global');
  }

  async createAuthUser(email: string, password: string, nome: string) {
    const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        throw new ConflictException('Este email já está cadastrado no sistema');
      }
      throw new InternalServerErrorException(
        `Erro ao criar usuário: ${error.message}`,
      );
    }

    return data.user;
  }
}
