import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { getAuthToken } from '@/utils/auth';

export const AUTH_SESSION_KEY = ['auth', 'session'] as const;

/**
 * Single cached current-user/session fetch for the whole app load.
 * Any number of components can call this; only one /auth request is made.
 */
export function useAuthSession() {
  const hasToken = Boolean(getAuthToken());

  const { data, isLoading } = useQuery({
    queryKey: AUTH_SESSION_KEY,
    queryFn: () => authService.getCurrentUser(),
    enabled: hasToken,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    user: data ?? null,
    isAuthenticated: hasToken && !!data,
    isLoading: hasToken ? isLoading : false,
  };
}
