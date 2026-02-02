import { logoutUserUserLogoutPost } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getProfileQueryOptions } from '@/query/queryHooks';

export const useLogout = (onSuccess?: () => void) => {
  const client = useQueryClient();
  const { mutate: logout, ...rest } = useMutation({
    mutationFn: () => dataExtractionWrapper(logoutUserUserLogoutPost()),
    onSuccess: () => {
      client.resetQueries({ queryKey: getProfileQueryOptions().queryKey });
      onSuccess?.();
    },
  });
  return { logout, ...rest };
};
