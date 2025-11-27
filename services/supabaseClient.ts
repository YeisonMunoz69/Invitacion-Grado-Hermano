import { createClient } from '@supabase/supabase-js';

// Obtener las credenciales desde variables de entorno
// Nota: En Vite, las variables de entorno deben tener el prefijo VITE_ para ser expuestas
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar configuradas');
  console.error('Por favor, crea un archivo .env en la raíz del proyecto con estas variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
