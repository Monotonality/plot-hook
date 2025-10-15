# Supabase Integration

- **Project URL**: https://fdhflzdcygxzjdrvngzq.supabase.co
- **Anon key**: use environment variable `SUPABASE_ANON_KEY`
- Ensure RLS is enabled and policies are configured. Never commit service keys.

## Environment variables
Create a `.env` file based on `.env.example`:

```
SUPABASE_URL=https://fdhflzdcygxzjdrvngzq.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## JavaScript client
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)
```

## Security
- Use the anon key in browsers only with RLS.
- Use the service key only in trusted server environments.
