import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eceokylztrtzfdjsyikh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZW9reWx6dHJ0emZkanN5aWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODEyMDIsImV4cCI6MjA3OTc1NzIwMn0.Gb7DgD6KvJQQ8BnCe54yPzSJeohbZoo82HhUiISmGWU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
