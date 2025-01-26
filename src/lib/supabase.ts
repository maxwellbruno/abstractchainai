import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtjnknpfeonpzlphsraa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0am5rbnBmZW9ucHpscGhzcmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzQ0NzAsImV4cCI6MjAyNTQxMDQ3MH0.vIgj-Kx-QXGDm6WUF2FhGVeEA3_GqGUzXfIKLHNV6yY';

export const supabase = createClient(supabaseUrl, supabaseKey);