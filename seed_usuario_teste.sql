-- =============================================================
-- Seed: Usuário de teste para o sistema Guindastes Ribas
-- Email: teste@gmail.com | Senha: teste123 | Cargo: admin
--
-- Execute no SQL Editor do Supabase (Project > SQL Editor)
-- =============================================================

DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
BEGIN

  -- 1. Criar usuário em auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    'teste@gmail.com',
    crypt('teste123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('nome', 'Usuário Teste'),
    now(),
    now(),
    '', '', '', ''
  );

  -- 2. Criar identity (necessário para login por email funcionar)
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    'teste@gmail.com',
    jsonb_build_object('sub', v_user_id::text, 'email', 'teste@gmail.com'),
    'email',
    now(),
    now(),
    now()
  );

  -- 3. Garantir que o profile existe com nome e cargo corretos.
  --    O trigger do Supabase já cria o profile automaticamente,
  --    mas fazemos upsert para garantir nome e cargo admin.
  INSERT INTO public.profiles (id, nome, cargo, email, created_at, updated_at)
  VALUES (v_user_id, 'Usuário Teste', 'admin', 'teste@gmail.com', now(), now())
  ON CONFLICT (id) DO UPDATE
    SET nome       = EXCLUDED.nome,
        cargo      = EXCLUDED.cargo,
        email      = EXCLUDED.email,
        updated_at = now();

  RAISE NOTICE 'Usuário criado com sucesso! ID: %', v_user_id;

END $$;
