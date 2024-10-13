import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kfnlsrvkrntzyzumqlym.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const PORT = process.env.PORT || 3000
