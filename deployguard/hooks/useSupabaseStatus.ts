import { useQuery } from "@tanstack/react-query";
import { supabase, isRealSupabaseAvailable, isRealAuthAvailable, isPublishableKey } from "@/lib/supabase";

export function useSupabaseStatus() {
  const query = useQuery({
    queryKey: ["supabase", "connection"],
    queryFn: () => supabase.checkConnection(),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  return {
    isConnected: query.data ?? false,
    isMockMode: !isRealSupabaseAvailable,
    isPublishableKeyMode: isPublishableKey,
    isAuthAvailable: isRealAuthAvailable,
    isLoading: query.isLoading,
  };
}
