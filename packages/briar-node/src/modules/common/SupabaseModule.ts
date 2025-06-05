import 'dotenv';

import { Global, Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ADMIN_KEY;
        return createClient(supabaseUrl, supabaseKey, {
          db: {
            schema: 'briar', // 设置默认 schema
          },
          auth: {
            persistSession: false, // 服务端建议关闭 session 持久化
          },
        });
      },
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
