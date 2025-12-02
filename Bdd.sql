-- Création de l'utilisateur et de son schéma
CREATE USER BDD_FRAG IDENTIFIED BY frag123;
GRANT CONNECT, RESOURCE, CREATE TABLE TO BDD_FRAG;

-- Connexion à l'utilisateur
CONNECT BDD_FRAG/frag123;

-- Création d'une table principale avec 30+ colonnes
CREATE TABLE Patients (
    patient_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(50),
    last_name VARCHAR2(50),
    birth_date DATE,
    gender VARCHAR2(10),
    national_id VARCHAR2(20),
    phone VARCHAR2(20),
    email VARCHAR2(50),
    address VARCHAR2(100),
    city VARCHAR2(50),
    wilaya VARCHAR2(50),
    registration_date DATE,
    blood_group VARCHAR2(5),
    allergies VARCHAR2(100),
    chronic_disease VARCHAR2(50),
    weight NUMBER,
    height NUMBER,
    medications VARCHAR2(100),
    smoker VARCHAR2(5),
    pregnancy_status VARCHAR2(20),
    doctor_id NUMBER,
    last_visit DATE,
    insurance_number VARCHAR2(20),
    emergency_contact VARCHAR2(50),
    emergency_phone VARCHAR2(20),
    room_id NUMBER,
    service_id NUMBER,
    admission_date DATE,
    discharge_date DATE,
    notes VARCHAR2(200),
    status VARCHAR2(20)
);

-- Création de tables annexes pour fragmentation / relations
CREATE TABLE Medecins (
    doctor_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(50),
    last_name VARCHAR2(50),
    specialty VARCHAR2(50),
    phone VARCHAR2(20),
    email VARCHAR2(50),
    department VARCHAR2(50),
    hire_date DATE
);

CREATE TABLE Services (
    service_id NUMBER PRIMARY KEY,
    service_name VARCHAR2(50),
    floor NUMBER,
    building VARCHAR2(5)
);

CREATE TABLE RendezVous (
    rdv_id NUMBER PRIMARY KEY,
    patient_id NUMBER REFERENCES Patients(patient_id),
    doctor_id NUMBER REFERENCES Medecins(doctor_id),
    rdv_date DATE,
    status VARCHAR2(20),
    room_id NUMBER,
    notes VARCHAR2(200)
);
