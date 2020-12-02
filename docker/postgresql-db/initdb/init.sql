CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.surveys
(
    id uuid NOT NULL DEFAULT uuid_generate_v1(),
    name text COLLATE pg_catalog."default",
    json text COLLATE pg_catalog."default",
    available BOOLEAN DEFAULT FALSE
)
WITH (
    OIDS = FALSE
)

TABLESPACE pg_default;

ALTER TABLE public.surveys
    OWNER to postgres;

CREATE TABLE public.results
(
    id uuid NOT NULL DEFAULT uuid_generate_v1(),
    postid text COLLATE pg_catalog."default",
    json text COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.results
    OWNER to postgres;

CREATE TABLE public.files(
    id uuid NOT NULL DEFAULT uuid_generate_v1(),
    name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE public.results
    OWNER to postgres;
