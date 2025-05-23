'use client';
import { createClient } from '@supabase/supabase-js';

import 'dotenv/config';

const supabaseUrl = 'https://zzcjbauazgbnnpxahajj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey!, {
	db: {
		schema: 'briar'
	}
});
