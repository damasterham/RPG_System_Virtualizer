-- Create DB
CREATE DATABASE rpgsv_db_test
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- Create test table

-- DROP TABLE public.test;

CREATE TABLE public.test
(
    id serial,
    value text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.test
    OWNER to postgres;

-- Add row to test table

INSERT INTO public.test(
	value)
	VALUES ('DB Test Successful');