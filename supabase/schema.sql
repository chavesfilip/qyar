-- ============================================================
-- QYAR — Schema completo do banco de dados
-- Execute no Supabase SQL Editor
-- ============================================================

-- 1. TABELA: restaurants
CREATE TABLE IF NOT EXISTS public.restaurants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  logo_url    TEXT,
  description TEXT,
  address     TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index para busca por slug (cardápio público)
CREATE INDEX IF NOT EXISTS restaurants_slug_idx ON public.restaurants (slug);
-- Index para busca por user_id (dashboard)
CREATE INDEX IF NOT EXISTS restaurants_user_id_idx ON public.restaurants (user_id);

-- 2. TABELA: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  "order"       INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS categories_restaurant_id_idx ON public.categories (restaurant_id);

-- 3. TABELA: dishes
CREATE TABLE IF NOT EXISTS public.dishes (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id   UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id     UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url       TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  is_vegetarian   BOOLEAN NOT NULL DEFAULT false,
  is_vegan        BOOLEAN NOT NULL DEFAULT false,
  is_spicy        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS dishes_restaurant_id_idx ON public.dishes (restaurant_id);
CREATE INDEX IF NOT EXISTS dishes_category_id_idx ON public.dishes (category_id);
CREATE INDEX IF NOT EXISTS dishes_is_available_idx ON public.dishes (is_available);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes        ENABLE ROW LEVEL SECURITY;

-- ---- restaurants ----
-- Leitura pública (cardápio)
CREATE POLICY "restaurants_public_read"
  ON public.restaurants FOR SELECT
  USING (true);

-- Somente o dono pode inserir/atualizar/deletar
CREATE POLICY "restaurants_owner_insert"
  ON public.restaurants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "restaurants_owner_update"
  ON public.restaurants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "restaurants_owner_delete"
  ON public.restaurants FOR DELETE
  USING (auth.uid() = user_id);

-- ---- categories ----
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories_owner_insert"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "categories_owner_update"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "categories_owner_delete"
  ON public.categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.user_id = auth.uid()
    )
  );

-- ---- dishes ----
CREATE POLICY "dishes_public_read"
  ON public.dishes FOR SELECT
  USING (true);

CREATE POLICY "dishes_owner_insert"
  ON public.dishes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "dishes_owner_update"
  ON public.dishes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "dishes_owner_delete"
  ON public.dishes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.user_id = auth.uid()
    )
  );

-- ============================================================
-- STORAGE BUCKET: restaurant-assets
-- Execute no Supabase Dashboard > Storage ou via SQL abaixo
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: qualquer um pode ler (imagens públicas)
CREATE POLICY "assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-assets');

-- Policy: autenticado pode fazer upload na sua pasta
CREATE POLICY "assets_owner_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-assets'
    AND auth.role() = 'authenticated'
  );

-- Policy: autenticado pode atualizar seus arquivos
CREATE POLICY "assets_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'restaurant-assets'
    AND auth.role() = 'authenticated'
  );

-- Policy: autenticado pode deletar seus arquivos
CREATE POLICY "assets_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-assets'
    AND auth.role() = 'authenticated'
  );
