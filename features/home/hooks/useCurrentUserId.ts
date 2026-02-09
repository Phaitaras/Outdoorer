import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useCurrentUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  return userId;
}
