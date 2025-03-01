CREATE TYPE public.training_status AS ENUM(
  'starting',
  'processing',
  'succeeded',
  'failed',
  'canceled'
);

CREATE TYPE public.gender AS ENUM(
  'man',
  'women'
);

CREATE TABLE
  public.models (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id UUID NULL DEFAULT auth.uid (),
    model_id TEXT NULL DEFAULT ''::TEXT,
    model_name TEXT NULL DEFAULT ''::TEXT,
    trigger_word TEXT NULL DEFAULT ''::TEXT,
    VERSION TEXT NULL DEFAULT ''::TEXT,
    training_status public.training_status NULL,
    training_steps NUMERIC NULL DEFAULT '0'::NUMERIC,
    training_time TEXT NULL,
    gender public.gender NULL DEFAULT 'man'::gender,
    training_id TEXT NULL,
    CONSTRAINT models_pkey PRIMARY KEY (id),
    CONSTRAINT models_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
  ) TABLESPACE pg_default;

-- Enable ROW level security
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Enable delete for users based on user_id
create policy "Enable delete for users based on user_id"
on "public"."models"
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));

-- Enable users to view their own data only
create policy "Enable users to view their own data only"
on "public"."models"
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
