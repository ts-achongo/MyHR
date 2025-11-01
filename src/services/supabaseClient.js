import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase - Projeto MyHR
const supabaseUrl = 'https://xhpcrvupywsemcfdclrv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocGNydnVweXdzZW1jZmRjbHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTIyNjUsImV4cCI6MjA3NTk4ODI2NX0.JOEwMt5aJKaeV1DtuxMm34AvXOWzm6USdDi2ehVmB20'

// Validação
if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ ERRO: Credenciais do Supabase não foram configuradas!')
}

export const supabase = createClient(supabaseUrl, supabaseKey)