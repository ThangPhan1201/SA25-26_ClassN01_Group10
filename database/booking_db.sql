--
-- PostgreSQL database dump
--

\restrict UVpEe9dUugEz96UW1Vvt7QSTW223w89o6EO29TSCuQu68JHSDeTQbb2DeFWa8KN

-- Dumped from database version 18.1 (Postgres.app)
-- Dumped by pg_dump version 18.1 (Postgres.app)

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.appointment_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled'
);


ALTER TYPE public.appointment_status OWNER TO postgres;

--
-- Name: department_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.department_type AS ENUM (
    'general_medicine',
    'cardiology',
    'neurology',
    'orthopedics',
    'pediatrics',
    'obstetrics_gynecology',
    'dermatology',
    'ophthalmology',
    'otorhinolaryngology',
    'dentistry',
    'psychiatry',
    'oncology',
    'endocrinology',
    'gastroenterology',
    'urology',
    'pulmonology',
    'nephrology',
    'rehabilitation'
);


ALTER TYPE public.department_type OWNER TO postgres;

--
-- Name: doctor_gender_enum; Type: TYPE; Schema: public; Owner: daongocthong
--

CREATE TYPE public.doctor_gender_enum AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public.doctor_gender_enum OWNER TO daongocthong;

--
-- Name: gender_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender_type AS ENUM (
    'man',
    'woman',
    'other'
);


ALTER TYPE public.gender_type OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'appointment',
    'reminder',
    'system'
);


ALTER TYPE public.notification_type OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'patient',
    'doctor',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: generate_numeric_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_numeric_id() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    len INT := floor(random() * 5 + 6); -- 6..10
BEGIN
    RETURN lpad(
        floor(random() * power(10, len))::text,
        len,
        '0'
    );
END;
$$;


ALTER FUNCTION public.generate_numeric_id() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    doctor_id bigint NOT NULL,
    appointment_date date NOT NULL,
    appointment_time time without time zone NOT NULL,
    status public.appointment_status DEFAULT 'pending'::public.appointment_status NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    location text
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_doctor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_doctor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_doctor_id_seq OWNER TO postgres;

--
-- Name: appointments_doctor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_doctor_id_seq OWNED BY public.appointments.doctor_id;


--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: appointments_patient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_patient_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_patient_id_seq OWNER TO postgres;

--
-- Name: appointments_patient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_patient_id_seq OWNED BY public.appointments.patient_id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id bigint NOT NULL,
    name_department character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id bigint NOT NULL,
    user_id character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    experience_year integer NOT NULL,
    description text,
    address text,
    patients_seen integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_of_birth date NOT NULL,
    department_id bigint,
    gender public.doctor_gender_enum DEFAULT 'male'::public.doctor_gender_enum,
    CONSTRAINT doctors_experience_year_check CHECK ((experience_year >= 0)),
    CONSTRAINT doctors_patients_seen_check CHECK ((patients_seen >= 0))
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_id_seq OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- Name: medical_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records (
    id bigint NOT NULL,
    appointment_id bigint NOT NULL,
    patient_id bigint NOT NULL,
    doctor_id bigint NOT NULL,
    symptoms text NOT NULL,
    diagnosis text NOT NULL,
    conclusion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.medical_records OWNER TO postgres;

--
-- Name: medical_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_records_id_seq OWNER TO postgres;

--
-- Name: medical_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_records_id_seq OWNED BY public.medical_records.id;


--
-- Name: medicines; Type: TABLE; Schema: public; Owner: daongocthong
--

CREATE TABLE public.medicines (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    brand_name character varying(255),
    unit character varying(50) NOT NULL,
    concentration character varying(100),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.medicines OWNER TO daongocthong;

--
-- Name: medicines_id_seq; Type: SEQUENCE; Schema: public; Owner: daongocthong
--

CREATE SEQUENCE public.medicines_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicines_id_seq OWNER TO daongocthong;

--
-- Name: medicines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: daongocthong
--

ALTER SEQUENCE public.medicines_id_seq OWNED BY public.medicines.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id character varying(255) NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    type public.notification_type NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title character varying(255) NOT NULL,
    target_url text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id bigint DEFAULT floor(((random() * ('9000000000'::bigint)::double precision) + (100000)::double precision)) NOT NULL,
    user_id character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    gender public.gender_type NOT NULL,
    date_of_birth date NOT NULL,
    phone character varying(20) NOT NULL,
    address text,
    health_insurance_number character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id bigint NOT NULL,
    medical_record_id bigint NOT NULL,
    medicine_name character varying(100) NOT NULL,
    dosage character varying(100) NOT NULL,
    usage text NOT NULL,
    medicine_id bigint
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_id_seq OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescriptions_id_seq OWNED BY public.prescriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(10) DEFAULT public.generate_numeric_id() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(50) NOT NULL,
    role public.user_role DEFAULT 'patient'::public.user_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    avatar character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: appointments patient_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN patient_id SET DEFAULT nextval('public.appointments_patient_id_seq'::regclass);


--
-- Name: appointments doctor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN doctor_id SET DEFAULT nextval('public.appointments_doctor_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- Name: medical_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records ALTER COLUMN id SET DEFAULT nextval('public.medical_records_id_seq'::regclass);


--
-- Name: medicines id; Type: DEFAULT; Schema: public; Owner: daongocthong
--

ALTER TABLE ONLY public.medicines ALTER COLUMN id SET DEFAULT nextval('public.medicines_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN id SET DEFAULT nextval('public.prescriptions_id_seq'::regclass);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, patient_id, doctor_id, appointment_date, appointment_time, status, note, created_at, location) FROM stdin;
39	2321033167	7	2026-02-03	13:30:00	cancelled	string	2026-02-02 23:51:17.407408	string
40	2321033167	7	2026-02-03	14:30:00	cancelled	string	2026-02-02 23:51:36.794903	string
41	2321033167	7	2026-02-03	15:30:00	cancelled	string	2026-02-02 23:51:39.689153	string
42	2321033167	7	2026-02-03	16:30:00	cancelled	string	2026-02-02 23:51:42.419556	string
11	2321033167	7	2026-02-11	10:30:00	completed	nothing	2026-02-01 01:21:05.615154	string
8	2321033167	7	2026-02-12	08:30:00	completed	string	2026-02-01 01:15:58.698249	string
7	2321033167	7	2026-02-12	07:00:00	completed	string	2026-02-01 01:15:23.62463	string
43	2321033167	7	2026-02-04	07:30:00	cancelled	string	2026-02-03 00:43:22.076675	string
12	2321033167	7	2026-02-12	14:30:00	completed	string	2026-02-02 11:28:56.31169	string
44	2321033167	7	2026-02-04	08:30:00	cancelled	string	2026-02-03 00:43:26.528076	string
9	2321033167	7	2026-02-12	09:30:00	completed	string	2026-02-01 01:16:25.919931	string
14	2321033167	7	2026-02-13	15:30:00	completed	string	2026-02-02 18:01:59.243106	string
13	2321033167	7	2026-02-13	10:30:00	completed	string	2026-02-02 14:19:55.68901	string
15	2321033167	7	2026-02-13	07:30:00	completed	string	2026-02-02 18:10:16.040323	string
16	2321033167	7	2026-02-13	09:30:00	completed	string	2026-02-02 18:15:32.475243	string
17	2321033167	7	2026-02-14	07:30:00	completed	string	2026-02-02 18:17:36.749983	string
18	2321033167	7	2026-02-14	08:30:00	completed	string	2026-02-02 18:17:40.781724	string
19	2321033167	7	2026-02-14	09:30:00	completed	string	2026-02-02 18:17:45.589281	string
20	2321033167	7	2026-02-10	07:30:00	completed	string	2026-02-02 18:48:49.688739	string
21	2321033167	7	2026-02-10	08:30:00	completed	string	2026-02-02 18:48:52.360184	string
22	2321033167	7	2026-02-10	09:30:00	completed	string	2026-02-02 18:48:56.049376	string
23	2321033167	7	2026-02-10	10:30:00	completed	string	2026-02-02 18:49:00.143615	string
24	2321033167	7	2026-02-10	13:30:00	completed	string	2026-02-02 18:49:05.60222	string
25	2321033167	7	2026-02-15	07:30:00	confirmed	string	2026-02-02 23:45:16.56967	string
26	2321033167	7	2026-02-15	08:30:00	confirmed	string	2026-02-02 23:45:19.749992	string
27	2321033167	7	2026-02-15	09:30:00	confirmed	string	2026-02-02 23:45:22.779409	string
28	2321033167	7	2026-02-15	10:30:00	confirmed	string	2026-02-02 23:45:26.552853	string
29	2321033167	7	2026-02-15	13:30:00	confirmed	string	2026-02-02 23:45:30.365325	string
30	2321033167	7	2026-02-15	14:30:00	confirmed	string	2026-02-02 23:45:33.701151	string
31	2321033167	7	2026-02-15	15:30:00	confirmed	string	2026-02-02 23:45:37.761092	string
32	2321033167	7	2026-02-15	16:30:00	confirmed	string	2026-02-02 23:45:42.904688	string
33	2321033167	7	2026-02-15	17:30:00	confirmed	string	2026-02-02 23:45:45.850579	string
35	2321033167	7	2026-02-03	08:30:00	confirmed	string	2026-02-02 23:46:48.899097	string
36	2321033167	7	2026-02-03	09:30:00	cancelled	string	2026-02-02 23:46:52.514884	string
37	2321033167	7	2026-02-03	10:30:00	confirmed	string	2026-02-02 23:46:55.916783	string
38	2321033167	7	2026-02-03	11:30:00	cancelled	string	2026-02-02 23:46:59.959445	string
34	2321033167	7	2026-02-03	07:30:00	completed	string	2026-02-02 23:46:42.066696	string
45	2321033167	7	2026-02-04	09:30:00	cancelled	string	2026-02-03 00:43:29.841055	string
46	2321033167	7	2026-02-04	10:30:00	cancelled	string	2026-02-03 00:43:36.91549	string
47	2321033167	7	2026-02-04	13:30:00	confirmed	string	2026-02-03 00:43:39.666667	string
48	2321033167	7	2026-02-04	14:30:00	confirmed	string	2026-02-03 00:52:47.425387	string
49	2321033167	7	2026-02-04	15:30:00	confirmed	string	2026-02-03 00:52:52.211816	string
50	2321033167	7	2026-02-04	16:30:00	confirmed	string	2026-02-03 01:17:40.489566	string
51	2321033167	7	2026-02-04	17:30:00	cancelled	string	2026-02-03 01:18:12.656186	string
52	2321033167	7	2026-02-16	07:30:00	pending	string	2026-02-03 01:19:09.953538	string
53	2321033167	7	2026-02-16	08:30:00	pending	string	2026-02-03 01:19:12.777623	string
54	2321033167	7	2026-02-16	09:30:00	pending	string	2026-02-03 01:19:16.112522	string
55	2321033167	7	2026-02-16	10:30:00	cancelled	string	2026-02-03 01:19:20.052934	string
56	2321033167	7	2026-02-27	07:00:00	pending	Đăng ký chuyên khoa undefined	2026-02-04 02:45:21.419673	\N
58	2321033167	7	2026-02-19	07:00:00	pending	Đăng ký khám chuyên khoa: Nội tổng quát	2026-02-04 02:55:24.498097	\N
61	2321033167	7	2026-02-20	07:00:00	cancelled	Đăng ký khám khoa Nội tổng quát	2026-02-04 03:02:03.489626	\N
68	2321033167	7	2026-02-22	10:30:00	confirmed	string	2026-02-04 04:15:05.246481	string
66	2321033167	7	2026-02-20	08:00:00	cancelled	Đăng ký khám khoa Nội tổng quát	2026-02-04 03:10:46.784509	\N
69	5102972909	8	2026-02-04	07:00:00	completed	Đăng ký khám khoa Tim mạch	2026-02-04 16:40:01.474464	\N
70	8848424438	10	2026-02-05	08:00:00	confirmed	Đăng ký khám khoa Nội tổng quát	2026-02-05 17:11:31.812959	\N
57	2321033167	7	2026-02-03	08:00:00	confirmed	Đăng ký chuyên khoa undefined	2026-02-04 02:45:50.802677	\N
72	2321033167	7	2026-02-07	08:00:00	cancelled	Registered for Nội tổng quát Department	2026-02-07 03:45:26.381731	\N
73	5985209724	8	2026-02-07	14:30:00	pending	Registered for Tim mạch Department	2026-02-07 04:07:35.031054	\N
74	2321033167	7	2026-02-07	14:30:00	confirmed	Registered for General Internal Medicine Department	2026-02-07 04:16:36.221067	\N
71	2321033167	7	2026-02-07	07:00:00	completed	Đăng ký khám khoa Nội tổng quát	2026-02-07 03:28:34.023985	\N
75	2321033167	7	2026-02-07	15:30:00	pending	Registered for General Internal Medicine Department	2026-02-07 14:26:22.925798	\N
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name_department, description, created_at) FROM stdin;
1	General Internal Medicine	Diagnosis and treatment of common internal diseases	2026-01-09 13:38:18.03963
2	Cardiology	Diagnosis and treatment of heart and vascular diseases	2026-01-09 13:38:18.03963
3	Neurology	Diagnosis and treatment of nervous system disorders	2026-01-09 13:38:18.03963
4	Orthopedics	Treatment of musculoskeletal injuries and conditions	2026-01-09 13:38:18.03963
5	Pediatrics	Healthcare and medical treatment for children	2026-01-09 13:38:18.03963
6	Obstetrics & Gynecology	Reproductive health, pregnancy, and childbirth care	2026-01-09 13:38:18.03963
7	Dermatology	Diagnosis and treatment of skin-related diseases	2026-01-09 13:38:18.03963
8	Ophthalmology	Examination and treatment of eye diseases	2026-01-09 13:38:18.03963
9	Otorhinolaryngology (ENT)	Treatment of ear, nose, and throat conditions	2026-01-09 13:38:18.03963
10	Odonto-Stomatology	Dental care and treatment of oral diseases	2026-01-09 13:38:18.03963
11	Psychiatry	Diagnosis and treatment of mental health disorders	2026-01-09 13:38:18.03963
12	Oncology	Diagnosis and treatment of various types of cancer	2026-01-09 13:38:18.03963
13	Endocrinology	Treatment of endocrine and metabolic disorders	2026-01-09 13:38:18.03963
14	Gastroenterology	Diagnosis and treatment of digestive system diseases	2026-01-09 13:38:18.03963
15	Urology	Treatment of urinary tract conditions	2026-01-09 13:38:18.03963
16	Pulmonology	Diagnosis and treatment of respiratory diseases	2026-01-09 13:38:18.03963
17	Nephrology & Dialysis	Treatment of kidney diseases and blood dialysis services	2026-01-09 13:38:18.03963
18	Rehabilitation	Recovery of motor functions and physical therapy after treatment	2026-01-09 13:38:18.03963
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, user_id, full_name, phone, experience_year, description, address, patients_seen, created_at, date_of_birth, department_id, gender) FROM stdin;
8	717374	Alexander Ramiez	09099232	15	Dedicated doctor providing trusted, compassionate medical care	American	0	2026-02-01 15:36:22.924327	1980-05-20	2	male
9	2452491	Nguyễn Phương Ngân	09123423422	4	Experienced doctor committed to quality healthcare	string	0	2026-02-01 16:02:25.235622	1990-05-22	3	female
10	427223	Anna Hathaway	015563342	10	string	string	0	2026-02-05 17:02:53.123939	1985-05-20	1	female
7	38682787	Lara Helenna	0977958514	10	Bác sĩ Đại học y Hà Nội	Texas, US	0	2026-01-31 16:21:29.304336	1985-05-20	1	female
\.


--
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records (id, appointment_id, patient_id, doctor_id, symptoms, diagnosis, conclusion, created_at) FROM stdin;
11	11	2321033167	7	Ho, sốt, đau họng	Viêm họng cấp	Uống thuốc đúng liều, tránh nước đá	2026-02-01 01:31:46.570568
12	8	2321033167	7	N/A	đau đầu	cảm cúm	2026-02-02 11:09:25.300346
13	12	2321033167	7	N/A	đau lưng	thoát vị đĩa đệm	2026-02-02 11:30:50.29771
14	7	2321033167	7	Khám định kỳ	Đau mỏi vai gáy	căng cứng cơ bắp	2026-02-02 17:48:43.82241
15	9	2321033167	7	Khám bệnh theo lịch	diagnosis test	conclusion test	2026-02-02 17:55:29.319957
16	14	2321033167	7	Khám bệnh theo lịch	test	test	2026-02-02 18:02:37.934742
17	13	2321033167	7	Khám bệnh định kỳ	test 13	test 13	2026-02-02 18:07:40.254702
18	15	2321033167	7	Khám bệnh định kỳ	test	test	2026-02-02 18:11:49.58774
19	16	2321033167	7	Khám bệnh định kỳ	test	test	2026-02-02 18:15:56.130715
20	17	2321033167	7	Khám bệnh định kỳ	Test	Test	2026-02-02 18:23:11.948275
21	18	2321033167	7	Khám bệnh	Test	Test	2026-02-02 18:26:05.368409
22	19	2321033167	7	Khám bệnh	test	test	2026-02-02 18:38:21.035768
23	20	2321033167	7	Khám bệnh định kỳ	test	test	2026-02-02 18:49:36.744985
24	21	2321033167	7	Khám bệnh định kỳ	test	test	2026-02-02 18:55:16.796727
25	22	2321033167	7	Khám bệnh định kỳ	Tức ngực, khó thở	rối loạn nhịp tim	2026-02-02 18:57:39.81394
26	23	2321033167	7	Khám bệnh định kỳ	nothing	nothing	2026-02-02 19:00:14.328988
27	24	2321033167	7	Khám bệnh định kỳ	Acute viral pharyngitis with mild tonsillar hypertrophy and secondary dehydration.	Patient should maintain adequate fluid intake, rest for 3 days, and take prescribed anti-inflammatory medication. Re-evaluate if fever persists over 48 hours.	2026-02-02 19:09:24.351328
28	34	2321033167	7	Khám bệnh định kỳ	Ho, rát họng, sổ mũi	Sốt cao	2026-02-02 23:49:05.144858
29	69	5102972909	8	Khám bệnh định kỳ	đau nhức toàn thân	sốt virus	2026-02-04 16:41:17.803187
30	71	2321033167	7	Khám bệnh định kỳ	The patient is in stable condition with symptoms consistent with a mild viral infection. No immediate complications are observed at this time. With appropriate self-care and symptomatic treatment, a full recovery is expected.	Mild viral upper respiratory infection.	2026-02-07 04:26:48.459896
\.


--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: daongocthong
--

COPY public.medicines (id, name, brand_name, unit, concentration, description, created_at, updated_at) FROM stdin;
1	Paracetamol	Panadol	Viên	500mg	Thuốc giảm đau, hạ sốt	2026-01-30 16:35:27.364561	2026-01-30 16:35:27.364561
2	Amoxicillin	Augmentin	Viên	625mg	Kháng sinh	2026-01-30 16:35:27.364561	2026-01-30 16:35:27.364561
3	Salu-Heral	Heral	Chai	100ml	Siro ho	2026-01-30 16:35:27.364561	2026-01-30 16:35:27.364561
4	Corticoid	Hanada	Viên	500mg	Thuốc giảm đau hạ sốt	2026-01-30 16:45:06.108726	2026-01-30 16:52:03.19353
5	Esomeprazole	Nexium	Viên	40mg	Thuốc ức chế bơm proton, điều trị trào ngược dạ dày thực quản và loét dạ dày.	2026-01-30 17:10:12.352035	2026-01-30 17:10:12.352035
6	Metformin	Glucophage	Viên	850mg	Thuốc điều trị bệnh tiểu đường tuýp 2.	2026-01-30 17:10:25.364241	2026-01-30 17:10:25.364241
7	Amlodipine	Amlor	Viên	5mg	Thuốc chẹn kênh calci, dùng để điều trị tăng huyết áp.	2026-01-30 17:10:37.45121	2026-01-30 17:10:37.45121
8	Salbutamol	Ventolin Nebules	Tép	2.5mg/2.5ml	Dung dịch dùng cho máy xông khí dung, điều trị hen suyễn và COPD.	2026-01-30 17:10:50.787605	2026-01-30 17:10:50.787605
9	Acetylcysteine	Mitux	Gói	200mg	Thuốc tiêu nhầy, dùng trong các bệnh lý đường hô hấp có đờm đặc.	2026-01-30 17:11:00.152964	2026-01-30 17:11:00.152964
10	Atorvastatin	Lipitor	Viên	20mg	Thuốc nhóm statin, dùng để hạ cholesterol máu và phòng ngừa bệnh tim mạch.	2026-01-30 17:11:07.158457	2026-01-30 17:11:07.158457
11	Clopidogrel	Plavix	Viên	75mg	Thuốc chống kết tập tiểu cầu, ngăn ngừa đột quỵ và nhồi máu cơ tim.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
12	Lisinopril	Zestril	Viên	10mg	Thuốc ức chế men chuyển (ACE), điều trị tăng huyết áp và suy tim.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
13	Rosuvastatin	Crestor	Viên	10mg	Thuốc hạ mỡ máu nhóm statin thế hệ mới.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
14	Azithromycin	Zithromax	Viên	500mg	Kháng sinh nhóm macrolid, điều trị nhiễm khuẩn hô hấp và da.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
15	Prednisolone	Solupred	Viên	5mg	Thuốc kháng viêm steroid (Corticosteroid).	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
16	Levofloxacin	Tavanic	Viên	500mg	Kháng sinh nhóm quinolone phổ rộng.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
17	Gliclazide	Diamicron MR	Viên	60mg	Thuốc điều trị tiểu đường nhóm sulfonylurea.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
18	Telmisartan	Micardis	Viên	40mg	Thuốc đối kháng thụ thể angiotensin II điều trị tăng huyết áp.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
19	Sildenafil	Viagra	Viên	50mg	Thuốc điều trị rối loạn cương dương.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
20	Clarithromycin	Klacid	Viên	500mg	Kháng sinh điều trị nhiễm khuẩn và phối hợp diệt vi khuẩn HP dạ dày.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
21	Ibuprofen	Gofen	Viên	400mg	Thuốc kháng viêm giảm đau không steroid (NSAID).	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
22	Montelukast	Singulair	Viên	10mg	Thuốc dự phòng và điều trị hen suyễn, viêm mũi dị ứng.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
23	Ceftriaxone	Rocephin	Lọ	1g	Kháng sinh tiêm truyền nhóm Cephalosporin thế hệ 3.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
24	Furosemide	Lasix	Viên	40mg	Thuốc lợi tiểu điều trị phù và tăng huyết áp.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
25	Diazepam	Seduxen	Viên	5mg	Thuốc an thần, điều trị lo âu và mất ngủ.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
26	Bisoprolol	Concor	Viên	5mg	Thuốc chẹn beta điều trị tăng huyết áp và đau thắt ngực.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
27	Diosmectite	Smecta	Gói	3g	Thuốc điều trị tiêu chảy cấp và mãn tính.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
28	Alpha Chymotrypsin	Alphachoay	Viên	4.2mg	Thuốc kháng viêm dạng men, điều trị phù nề sau chấn thương.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
29	Ciprofloxacin	Ciprobay	Viên	500mg	Kháng sinh điều trị nhiễm trùng đường tiết niệu và tiêu hóa.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
30	Loratadine	Clarityne	Viên	10mg	Thuốc kháng histamine điều trị dị ứng không gây buồn ngủ.	2026-02-07 04:11:20.287447	2026-02-07 04:11:20.287447
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, content, is_read, type, created_at, title, target_url) FROM stdin;
21	4994472484	Lịch khám ngày 2026-02-12 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-02 17:54:58.443281+07	Cập nhật lịch hẹn	/appointments/9
23	4994472484	Lịch khám ngày 2026-02-13 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-02 18:06:05.548124+07	Cập nhật lịch hẹn	/appointments/13
20	4994472484	Lịch khám ngày 2026-02-12 đã chuyển sang trạng thái: COMPLETED	t	appointment	2026-02-02 17:54:35.091176+07	Cập nhật lịch hẹn	/appointments/12
19	4994472484	Lịch khám ngày 2026-02-12 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-02 17:53:22.03205+07	Cập nhật lịch hẹn	/appointments/12
13	4994472484	Lịch khám ngày 2026-02-12 đã chuyển sang trạng thái: CANCELLED	t	appointment	2026-02-01 23:54:05.19469+07	Cập nhật lịch hẹn	/my-appointments
18	4994472484	Lịch khám ngày 2026-02-13 đã chuyển sang trạng thái: CANCELLED	t	appointment	2026-02-02 14:36:34.515317+07	Cập nhật lịch hẹn	/appointments/13
14	4994472484	Lịch khám ngày 2026-02-12 đã chuyển sang trạng thái: PENDING	t	appointment	2026-02-02 00:07:33.255627+07	Cập nhật lịch hẹn	/appointments/7
17	4994472484	Lịch khám ngày 2026-02-12 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-02 14:35:42.025068+07	Cập nhật lịch hẹn	/appointments/7
12	4994472484	Lịch khám ngày 2026-02-11 đã chuyển sang trạng thái: COMPLETED	t	appointment	2026-02-01 01:28:00.564569+07	Cập nhật lịch hẹn	/my-appointments
11	4994472484	Lịch khám ngày 2026-02-11 đã chuyển sang trạng thái: PENDING	t	appointment	2026-02-01 01:27:28.290988+07	Cập nhật lịch hẹn	/my-appointments
102	3077886565	Bệnh nhân Nguyễn Thị Dịu đã đặt lịch khám vào 08:00:00 ngày 2026-02-05  CONFIRMED	f	appointment	2026-02-05 17:11:48.126012+07	Lịch hẹn mới	/appointments/70
106	38682787	Patient Lê Thị Hoài Linh scheduled an appointment for 2026-02-07	t	appointment	2026-02-07 03:45:26.387578+07	New Appointment	/appointments/72
99	717374	Bệnh nhân Phan Văn Thắng đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-04 16:40:01.480527+07	Lịch hẹn mới	/appointments/69
109	717374	Patient Alex Rondor scheduled an appointment for 2026-02-07	f	appointment	2026-02-07 04:07:35.03579+07	New Appointment	/appointments/73
111	4994472484	Patient Kelly Rachael scheduled an appointment for 14:30:00 on 2026-02-07  CONFIRMED	f	appointment	2026-02-07 04:18:53.408329+07	New Appointment	/appointments/74
42	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:45.853008+07	Lịch hẹn mới	/appointments/33
45	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:46:52.516939+07	Lịch hẹn mới	/appointments/36
44	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:46:48.901015+07	Lịch hẹn mới	/appointments/35
43	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:46:42.070133+07	Lịch hẹn mới	/appointments/34
41	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:42.90705+07	Lịch hẹn mới	/appointments/32
37	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:26.555697+07	Lịch hẹn mới	/appointments/28
40	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:37.763007+07	Lịch hẹn mới	/appointments/31
36	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:22.781755+07	Lịch hẹn mới	/appointments/27
38	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:30.3678+07	Lịch hẹn mới	/appointments/29
39	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:33.704297+07	Lịch hẹn mới	/appointments/30
35	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:19.752472+07	Lịch hẹn mới	/appointments/26
34	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-15	t	appointment	2026-02-02 23:45:16.577614+07	Lịch hẹn mới	/appointments/25
33	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-10	t	appointment	2026-02-02 18:49:05.604245+07	Lịch hẹn mới	/appointments/24
32	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-10	t	appointment	2026-02-02 18:49:00.14619+07	Lịch hẹn mới	/appointments/23
31	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-10	t	appointment	2026-02-02 18:48:56.076013+07	Lịch hẹn mới	/appointments/22
27	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-14	t	appointment	2026-02-02 18:17:40.896643+07	Lịch hẹn mới	/appointments/18
30	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-10	t	appointment	2026-02-02 18:48:52.362904+07	Lịch hẹn mới	/appointments/21
29	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-10	t	appointment	2026-02-02 18:48:49.692041+07	Lịch hẹn mới	/appointments/20
28	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-14	t	appointment	2026-02-02 18:17:45.59109+07	Lịch hẹn mới	/appointments/19
26	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-14	t	appointment	2026-02-02 18:17:36.752906+07	Lịch hẹn mới	/appointments/17
25	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-13	t	appointment	2026-02-02 18:15:32.479347+07	Lịch hẹn mới	/appointments/16
22	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-13	t	appointment	2026-02-02 18:01:59.2469+07	Lịch hẹn mới	/appointments/14
24	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-13	t	appointment	2026-02-02 18:10:16.043252+07	Lịch hẹn mới	/appointments/15
15	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-12	t	appointment	2026-02-02 11:28:56.316389+07	Lịch hẹn mới	/appointments/12
16	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-13	t	appointment	2026-02-02 14:19:55.691941+07	Lịch hẹn mới	/appointments/13
10	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-11	t	appointment	2026-02-01 01:21:05.620091+07	Lịch hẹn mới	/appointments/11
9	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-12	t	appointment	2026-02-01 01:16:25.923909+07	Lịch hẹn mới	/appointments/9
8	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-12	t	appointment	2026-02-01 01:15:58.70143+07	Lịch hẹn mới	/appointments/8
7	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-12	t	appointment	2026-02-01 01:15:23.632802+07	Lịch hẹn mới	/appointments/7
80	4994472484	Lịch hẹn lúc 17:30:00 ngày 2026-02-04 đã bị huỷ.	t	appointment	2026-02-03 01:18:17.609785+07	Cập nhật lịch hẹn	/appointments/51
86	4994472484	Lịch hẹn lúc 10:30:00 ngày 2026-02-16 đã bị huỷ.	t	appointment	2026-02-04 00:49:38.103985+07	Cập nhật lịch hẹn	/appointments/55
78	4994472484	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào 16:30:00 ngày 2026-02-04  CONFIRMED	t	appointment	2026-02-03 01:17:51.264799+07	Lịch hẹn mới	/appointments/50
76	4994472484	Lịch khám ngày 2026-02-04 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-03 01:13:15.924385+07	Cập nhật lịch hẹn	/appointments/49
75	4994472484	Lịch khám ngày 2026-02-04 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-03 01:12:37.848458+07	Cập nhật lịch hẹn	/appointments/48
72	4994472484	Lịch hẹn lúc 10:30:00 ngày 2026-02-04 đã bị huỷ.	t	appointment	2026-02-03 00:53:14.048803+07	Cập nhật lịch hẹn	/appointments/46
70	4994472484	Lịch hẹn lúc 09:30:00 ngày 2026-02-04 đã bị huỷ.	t	appointment	2026-02-03 00:53:04.471012+07	Cập nhật lịch hẹn	/appointments/45
74	4994472484	Lịch khám ngày 2026-02-04 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-03 01:07:41.046752+07	Cập nhật lịch hẹn	/appointments/47
67	4994472484	Lịch khám ngày 2026-02-04 đã chuyển sang trạng thái: CANCELLED	t	appointment	2026-02-03 00:45:00.517116+07	Cập nhật lịch hẹn	/appointments/44
66	4994472484	Lịch khám ngày 2026-02-04 đã chuyển sang trạng thái: CANCELLED	t	appointment	2026-02-03 00:44:31.67191+07	Cập nhật lịch hẹn	/appointments/43
60	4994472484	Lịch hẹn lúc 16:30:00 ngày 2026-02-03 đã bị huỷ.	t	appointment	2026-02-03 00:41:40.362657+07	Cập nhật lịch hẹn	/appointments/42
59	4994472484	Lịch hẹn vào 15:30:00 ngày 2026-02-03 đã bị huỷ.	t	appointment	2026-02-03 00:33:52.336741+07	Cập nhật lịch hẹn	/appointments/41
58	4994472484	Lịch hẹn vào 14:30:00 ngày 2026-02-03 đã bị huỷ.	t	appointment	2026-02-03 00:33:49.254268+07	Cập nhật lịch hẹn	/appointments/40
57	4994472484	Lịch khám lúc 13:30:00 ngày 2026-02-03 đã được hủy.	t	appointment	2026-02-03 00:25:46.433926+07	Cập nhật lịch hẹn	/appointments/39
52	4994472484	Lịch khám ngày 2026-02-03 đã chuyển sang trạng thái: CANCELLED	t	appointment	2026-02-02 23:48:22.205552+07	Cập nhật lịch hẹn	/appointments/38
51	4994472484	Lịch khám ngày 2026-02-03 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-02 23:48:16.441865+07	Cập nhật lịch hẹn	/appointments/37
50	4994472484	Lịch khám ngày 2026-02-03 đã chuyển sang trạng thái: CANCELLED	t	appointment	2026-02-02 23:48:01.251303+07	Cập nhật lịch hẹn	/appointments/36
49	4994472484	Lịch khám ngày 2026-02-03 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-02 23:47:53.663019+07	Cập nhật lịch hẹn	/appointments/35
48	4994472484	Lịch khám ngày 2026-02-03 đã chuyển sang trạng thái: CONFIRMED	t	appointment	2026-02-02 23:47:13.402297+07	Cập nhật lịch hẹn	/appointments/34
100	399638	Bệnh nhân Phan Văn Thắng đã đặt lịch khám vào 07:00:00 ngày 2026-02-04  CONFIRMED	f	appointment	2026-02-04 16:40:26.27516+07	Lịch hẹn mới	/appointments/69
103	4994472484	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào 08:00:00 ngày 2026-02-03  CONFIRMED	f	appointment	2026-02-06 14:43:26.569815+07	Lịch hẹn mới	/appointments/57
107	4994472484	The appointment scheduled for 08:00:00 on 2026-02-07 has been cancelled.	f	appointment	2026-02-07 03:45:55.853716+07	Update your appointment.	/appointments/72
83	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-16	t	appointment	2026-02-03 01:19:12.781457+07	Lịch hẹn mới	/appointments/53
84	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-16	t	appointment	2026-02-03 01:19:16.115536+07	Lịch hẹn mới	/appointments/54
79	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 01:18:12.659162+07	Lịch hẹn mới	/appointments/51
81	38682787	Lịch hẹn lúc 17:30:00 ngày 2026-02-04 đã bị huỷ.	t	appointment	2026-02-03 01:18:17.612516+07	Cập nhật lịch hẹn	/appointments/51
77	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 01:17:40.4962+07	Lịch hẹn mới	/appointments/50
69	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 00:52:52.213507+07	Lịch hẹn mới	/appointments/49
71	38682787	Lịch hẹn lúc 09:30:00 ngày 2026-02-04 đã bị huỷ.	t	appointment	2026-02-03 00:53:04.473881+07	Cập nhật lịch hẹn	/appointments/45
88	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-27	t	appointment	2026-02-04 02:45:21.426731+07	Lịch hẹn mới	/appointments/56
89	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-04 02:45:50.805779+07	Lịch hẹn mới	/appointments/57
85	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-16	t	appointment	2026-02-03 01:19:20.054975+07	Lịch hẹn mới	/appointments/55
65	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 00:43:39.671829+07	Lịch hẹn mới	/appointments/47
73	38682787	Lịch hẹn lúc 10:30:00 ngày 2026-02-04 đã bị huỷ.	t	appointment	2026-02-03 00:53:14.051123+07	Cập nhật lịch hẹn	/appointments/46
64	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 00:43:36.949692+07	Lịch hẹn mới	/appointments/46
62	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 00:43:26.5315+07	Lịch hẹn mới	/appointments/44
61	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 00:43:22.081439+07	Lịch hẹn mới	/appointments/43
63	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 00:43:29.844034+07	Lịch hẹn mới	/appointments/45
56	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:51:42.421762+07	Lịch hẹn mới	/appointments/42
55	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:51:39.692803+07	Lịch hẹn mới	/appointments/41
54	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:51:36.796994+07	Lịch hẹn mới	/appointments/40
53	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:51:17.409444+07	Lịch hẹn mới	/appointments/39
47	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:46:59.961265+07	Lịch hẹn mới	/appointments/38
46	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-03	t	appointment	2026-02-02 23:46:55.91992+07	Lịch hẹn mới	/appointments/37
96	4994472484	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào 10:30:00 ngày 2026-02-22  CONFIRMED	t	appointment	2026-02-04 04:15:18.919038+07	Lịch hẹn mới	/appointments/68
97	4994472484	Lịch hẹn lúc 08:00:00 ngày 2026-02-20 đã bị huỷ.	t	appointment	2026-02-04 14:09:48.909231+07	Cập nhật lịch hẹn	/appointments/66
93	4994472484	Lịch hẹn lúc 07:00:00 ngày 2026-02-20 đã bị huỷ.	t	appointment	2026-02-04 03:11:09.01393+07	Cập nhật lịch hẹn	/appointments/61
101	427223	Bệnh nhân Nguyễn Thị Dịu đã đặt lịch khám vào ngày 2026-02-05	t	appointment	2026-02-05 17:11:31.824571+07	Lịch hẹn mới	/appointments/70
98	38682787	Lịch hẹn lúc 08:00:00 ngày 2026-02-20 đã bị huỷ.	t	appointment	2026-02-04 14:09:48.913352+07	Cập nhật lịch hẹn	/appointments/66
95	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-22	t	appointment	2026-02-04 04:15:05.249614+07	Lịch hẹn mới	/appointments/68
92	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-20	t	appointment	2026-02-04 03:10:46.788497+07	Lịch hẹn mới	/appointments/66
94	38682787	Lịch hẹn lúc 07:00:00 ngày 2026-02-20 đã bị huỷ.	t	appointment	2026-02-04 03:11:09.016961+07	Cập nhật lịch hẹn	/appointments/61
91	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-20	t	appointment	2026-02-04 03:02:03.49226+07	Lịch hẹn mới	/appointments/61
87	38682787	Lịch hẹn lúc 10:30:00 ngày 2026-02-16 đã bị huỷ.	t	appointment	2026-02-04 00:49:38.112844+07	Cập nhật lịch hẹn	/appointments/55
90	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-19	t	appointment	2026-02-04 02:55:24.502937+07	Lịch hẹn mới	/appointments/58
68	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-04	t	appointment	2026-02-03 00:52:47.431001+07	Lịch hẹn mới	/appointments/48
82	38682787	Bệnh nhân Lê Thị Hoài Linh đã đặt lịch khám vào ngày 2026-02-16	t	appointment	2026-02-03 01:19:09.956627+07	Lịch hẹn mới	/appointments/52
105	4994472484	Patient Lê Thị Hoài Linh scheduled an appointment for 07:00:00 on 2026-02-07  CONFIRMED	f	appointment	2026-02-07 03:28:53.369761+07	New Appointment	/appointments/71
108	38682787	The appointment scheduled for 08:00:00 on 2026-02-07 has been cancelled.	t	appointment	2026-02-07 03:45:55.856635+07	Update your appointment.	/appointments/72
104	38682787	Patient Lê Thị Hoài Linh scheduled an appointment for 2026-02-07	t	appointment	2026-02-07 03:28:34.040903+07	New Appointment	/appointments/71
110	38682787	Patient Kelly Rachael scheduled an appointment for 2026-02-07	f	appointment	2026-02-07 04:16:36.224769+07	New Appointment	/appointments/74
112	38682787	Patient Kelly Rachael scheduled an appointment for 2026-02-07	f	appointment	2026-02-07 14:26:22.933718+07	New Appointment	/appointments/75
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, user_id, full_name, gender, date_of_birth, phone, address, health_insurance_number, created_at) FROM stdin;
2559877390	528161575	Nguyễn Văn Nam	man	1990-01-01	0901234567	123 Đường ABC, Quận 1, TP.HCM	BH123456789	2026-01-29 21:47:43.519491
4012707394	647673073	đào ngọc thông	man	2005-01-30	0977958514	nhà không số, ngõ 74 Yên Bình, tổ 15 - Yên Nghĩa - Hà Đông - Hà Nội	BH123455623	2026-02-04 16:35:17.522381
5102972909	399638	Phan Văn Thắng	man	2000-04-03	097623412	lang thang	BH9865431	2026-02-04 16:39:00.597256
8984456257	7615181268	Trần Văn Huy	man	2000-05-17	0988123411	Hoài Đức, Hà Nội	333721195420	2026-02-05 16:53:35.927606
8848424438	3077886565	Nguyễn Thị Dịu	woman	2004-05-12	091235521	Yên Mỹ, Hưng Yên	1234562008	2026-02-05 16:54:45.713724
540658128	0833375	Andrea Anna	woman	2000-09-19	0192824213	Northway, American	235678346	2026-02-05 16:57:28.022647
5939016846	970823555	Nguyễn Trọng Thái	man	2002-04-08	340985675	Tokyo, Japan	12434645	2026-02-05 16:59:30.072944
7548827955	10205239	Christina Mia	woman	1996-04-15	0987649983	Berlin, Germany	6674342AH87G	2026-02-05 17:01:18.80334
5985209724	352269	Alex Rondor	man	1993-01-03	09876512	United Kingdom	UK199587253	2026-02-05 16:58:35.16862
2321033167	4994472484	Kelly Rachael	man	2005-05-12	09012345671	Chương Mỹ, Hà Nội	BH12345678912	2026-01-30 17:17:18.325128
4745796262	383492	Alex Han	man	1990-05-09	0977958515	123 ABC Street	BH09246323	2026-02-07 12:31:46.028649
\.


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, medical_record_id, medicine_name, dosage, usage, medicine_id) FROM stdin;
6	12	Amoxicillin 625mg	10 pills	2 times/day	2
7	13	Metformin 850mg	2 pills	2 times/day	6
8	24	Paracetamol 500mg	12 pills	2 times/day	1
9	25	Amlodipine 5mg	15 pills	3 times/day	7
10	25	Amoxicillin 625mg	7 pills	3 times/day	2
11	27	Atorvastatin 20mg	8 pills	2 times/day	10
12	27	Esomeprazole 40mg	7 pillss	3 times/day	5
13	27	Acetylcysteine 200mg	12 pills	3 times/day	9
14	27	Paracetamol 500mg	15 pills	3 times/day	1
15	28	Paracetamol 500mg	6 pills	2  times/day	1
16	29	Paracetamol 500mg	12 pills	2 times/day	1
17	30	Sildenafil 50mg	8 pills	3 times/day	19
18	30	Acetylcysteine 200mg	10 pills	2 times/day	9
19	30	Amlodipine 5mg	12 pills	2 times/day	7
20	30	Telmisartan 40mg	14 pills	3 times/day	18
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, username, role, is_active, created_at, avatar) FROM stdin;
528161575	test@gmail.com	$2b$10$U1MVoccQRatFXHnZTXC7/OzDDOzQGZh1QiGJn5fcxuKDbCDK8uX..	testlogin	patient	t	2026-01-16 18:51:36.287335+07	\N
661126397	thongdaongoc.pka@gmail.com	$2b$10$kjEs2w4JVKlNURlN6oIT5u6MC.37sQ2ekrd5.lbeSkgKILd5hU4OC	daothong2005	patient	t	2026-01-16 21:58:06.238592+07	\N
582378341	thangphan_kc@gmail.com	$2b$10$atwnIk6zAfeuB89h16uR1e5Qzjocuvuf60r.0esXB2gFtrnTnV/V2	phan_van_thang.pka112	patient	t	2026-01-16 21:59:22.122049+07	\N
224494	hoailinh_le.chmy@gmail.com	$2b$10$2YjukmrEgePQ50OLbv6udOcsX4mTLVrrgEZfSkZC9up9i1YSwt6XS	hoailinhle.pinnie	patient	t	2026-01-16 22:00:29.759615+07	\N
38682787	doctor_test@gmail.com	$2b$10$t1zdiV2hU.rTV1hZj7fgLuRX3lk0dc1Wh0N8G37xYJLljBz.mzU3e	test_doctor	doctor	t	2026-01-31 16:20:11.958706+07	doctor_7.jpg
717374	test_doctor2@gmail.com	$2b$10$gkfU2rXeBKzXSfI17dUjbu.Xgzi9K142aAWCS.7KEsUZaMwvrqAFu	test_doctor2	doctor	t	2026-02-01 15:34:08.649194+07	doctor_8.jpg
2452491	test_doctr3@gmail.com	$2b$10$/f1KWQ5gBCiiANBBqhxWLubfTzdVlKPNBgOBY2OGA3G2hLOy3.ELe	test_doctor3	doctor	t	2026-02-01 15:58:45.831858+07	doctor_9.jpg
4994472484	user_test@gmail.com	$2b$10$5ms8WoDRB36sNQENcq7OVuTBJVK0xo2ZyK99FjO5jDD6U2qDL7BUW	user_test_final	patient	t	2026-01-30 17:14:25.670666+07	/avatar/user_4994472484.jpg
647673073	test_register@gmail.com	$2b$10$pY85mxEJs4fdnqdl7J15/OMMeg17UPtENR132aEn2Fv.FcSPv0jdK	test_register	patient	t	2026-02-04 16:35:17.486592+07	\N
399638	test_upload_avatar@gmail.com	$2b$10$Ss1aKDi6U0uEpJdcRX.PLuP1Cvv77lJDRmmw4gwtpyCEB/HrL8osy	test_register2	patient	t	2026-02-04 16:39:00.586537+07	/avatar/user_399638.webp
339750	test_admin@gmail.com	$2b$10$j.MzBQtsrL2oHQyAVthyE.F6yEqnkJfXfaNv6CNo/NOvdmNdSIE.u	test_admin	admin	t	2026-02-05 14:16:24.12128+07	\N
7615181268	huytran@gmail.com	$2b$10$YE7.xWKM1NO94ggJdOkG9OC/rbdUjqUIhfjlaaDsSX32Jp7Qhe3d6	tranhuy123	patient	t	2026-02-05 16:53:35.91613+07	/avatar/user_7615181268.jpg
3077886565	diu_cute@gmail.com	$2b$10$VMROPxip/gjuPno4CgBk8e.gSlz5B2A/yRH8JgfWpmCN.d/Dfps5K	diu_nguyen198	patient	t	2026-02-05 16:54:45.706165+07	/avatar/user_3077886565.jpg
0833375	anna-andree@gmail.com	$2b$10$hJTiE7goCbyrn7eZZEQIHunxMq57P9bTjUwDZOx5EKwqzBcUMgjim	anna_andree	patient	t	2026-02-05 16:57:28.012217+07	/avatar/user_0833375.jpg
352269	alex_rondor@gmail.com	$2b$10$.4ydPv.yvh5BzT1fXpHoN.hh1IyADQ4BJR1MXW/IZKFvmhaJ8EoR6	alex_rondor	patient	t	2026-02-05 16:58:35.161846+07	/avatar/user_352269.jpg
970823555	thai_vntrg@gmail.com	$2b$10$kjas71do0EC/xDR4tC2ab.Zb0yLaABGdohr.0JX9iZIYvNr2Pn62i	trong_thai	patient	t	2026-02-05 16:59:30.063917+07	/avatar/user_970823555.jpg
10205239	mia_christin@gmail.com	$2b$10$M/9XOEUCLOGl/4oeoXCOuOng283XMZ4g9drzuqcey0/JmnOWjZFS2	anna_christina_br	patient	t	2026-02-05 17:01:18.796545+07	/avatar/user_10205239.jpg
427223	test_doctor10@gmail.com	$2b$10$kUhtyN.pxfQzmOOe26G8j.e5QOorsRErI8wDNfhigXXs0LkqEi.1q	doctor_10	doctor	t	2026-02-05 17:01:59.915234+07	doctor_10.jpg
383492	alex_han@gmail.com	$2b$10$j15NkEDr7NRf0J0e79vl/OrDIndktJVWi4niyKT88uqAzb6uEVFty	alex_han	patient	t	2026-02-07 12:31:45.99177+07	/avatar/user_383492.jpg
\.


--
-- Name: appointments_doctor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_doctor_id_seq', 1, false);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 75, true);


--
-- Name: appointments_patient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_patient_id_seq', 1, false);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 19, true);


--
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctors_id_seq', 10, true);


--
-- Name: medical_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_records_id_seq', 30, true);


--
-- Name: medicines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: daongocthong
--

SELECT pg_catalog.setval('public.medicines_id_seq', 30, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 112, true);


--
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 20, true);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: departments departments_name_department_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_department_key UNIQUE (name_department);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_phone_key UNIQUE (phone);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: medical_records medical_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_pkey PRIMARY KEY (id);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: daongocthong
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: patients patients_health_insurance_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_health_insurance_number_key UNIQUE (health_insurance_number);


--
-- Name: patients patients_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_phone_key UNIQUE (phone);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- Name: appointments unique_doctor_time; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT unique_doctor_time UNIQUE (doctor_id, appointment_date, appointment_time);


--
-- Name: prescriptions unique_medicine_per_record; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT unique_medicine_per_record UNIQUE (medical_record_id, medicine_name);


--
-- Name: appointments unique_patient_time; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT unique_patient_time UNIQUE (patient_id, appointment_date, appointment_time);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_medicine_name; Type: INDEX; Schema: public; Owner: daongocthong
--

CREATE INDEX idx_medicine_name ON public.medicines USING btree (name);


--
-- Name: idx_notifications_user_unread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_unread ON public.notifications USING btree (user_id, is_read, created_at DESC);


--
-- Name: appointments fk_appointments_doctor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: appointments fk_appointments_patient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: doctors fk_doctors_department; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT fk_doctors_department FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: doctors fk_doctors_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT fk_doctors_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: medical_records fk_medical_records_appointment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT fk_medical_records_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;


--
-- Name: medical_records fk_medical_records_doctor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT fk_medical_records_doctor FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: medical_records fk_medical_records_patient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT fk_medical_records_patient FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notifications_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: patients fk_patients_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: prescriptions fk_prescriptions_medical_record; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT fk_prescriptions_medical_record FOREIGN KEY (medical_record_id) REFERENCES public.medical_records(id) ON DELETE CASCADE;


--
-- Name: prescriptions fk_prescriptions_medicine; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT fk_prescriptions_medicine FOREIGN KEY (medicine_id) REFERENCES public.medicines(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict UVpEe9dUugEz96UW1Vvt7QSTW223w89o6EO29TSCuQu68JHSDeTQbb2DeFWa8KN

