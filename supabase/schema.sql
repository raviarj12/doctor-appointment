-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.appointments;
DROP TABLE IF EXISTS public.doctors;

-- Create the appointments table with proper permissions
CREATE TABLE IF NOT EXISTS public.appointments (
  id SERIAL PRIMARY KEY,
  doctor VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  medical_reason TEXT NOT NULL,
  additional_notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table with proper permissions
CREATE TABLE IF NOT EXISTS public.doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience_years INTEGER NOT NULL,
  education TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grant access to the public role
GRANT ALL ON public.appointments TO anon, authenticated;
GRANT ALL ON public.doctors TO anon, authenticated;

-- Insert sample doctors data
INSERT INTO public.doctors (name, specialization, experience_years, education)
VALUES 
    ('Dr. Jadav Pruthaviraj', 'Physiotherapist', 4, 'BPT, Gujarat University'),
    ('Dr. Jadav Apexa', 'BHMS Doctor', 6, 'BHMS, Gujarat University');

-- Insert a sample appointment
INSERT INTO public.appointments (
    doctor,
    appointment_date,
    appointment_time,
    patient_name,
    contact_number,
    medical_reason,
    additional_notes,
    status
)
VALUES (
    'Dr. John Smith',
    CURRENT_DATE,
    '10:00:00',
    'Jane Doe',
    '123-456-7890',
    'Regular checkup',
    'First visit',
    'pending'
); 