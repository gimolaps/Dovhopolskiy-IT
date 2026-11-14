--
-- PostgreSQL database dump
--

\restrict qDmiyLyTSC5s2LPHkypmakuqxi3DjMlTXSVBzqMdU7Id9CD3cdc2U5xpZ6pGQ5Q

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-14 16:14:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id bigint NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(30),
    email character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16401)
-- Name: repair_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.repair_orders (
    id bigint NOT NULL,
    customer_id bigint NOT NULL,
    device_type character varying(50) NOT NULL,
    device_model character varying(100),
    problem_description text NOT NULL,
    status character varying(30) DEFAULT 'NEW'::character varying NOT NULL,
    estimated_price numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.repair_orders OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16400)
-- Name: repair_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.repair_orders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.repair_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4865 (class 2606 OID 16399)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 16415)
-- Name: repair_orders repair_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repair_orders
    ADD CONSTRAINT repair_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 16416)
-- Name: repair_orders fk_repair_customer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repair_orders
    ADD CONSTRAINT fk_repair_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id);


-- Completed on 2026-11-14 16:14:00

--
-- PostgreSQL database dump complete
--

\unrestrict qDmiyLyTSC5s2LPHkypmakuqxi3DjMlTXSVBzqMdU7Id9CD3cdc2U5xpZ6pGQ5Q

