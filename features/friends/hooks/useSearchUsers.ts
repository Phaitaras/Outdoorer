import type { Profile } from '@/features/profile/types';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

async function searchUsers(query: string): Promise<Profile[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from('profile')
    .select('id, username, title, metric, activity_types, onboarded, created_at, activity_visibility')
    .ilike('username', `%${trimmed}%`)
    .limit(10);

  if (error) throw error;
  return (data ?? []) as Profile[];
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 2,
  });
}
