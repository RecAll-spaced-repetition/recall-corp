import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getProfileQueryOptions } from '@/query/queryHooks';
import { authenticateUserUserLoginPost, User } from '@/api';
import { UserLoginData } from '@/components/auth/LoginForm';
import { refreshSubscription } from '@/setupNotifications';

export const useLogin = (onSuccess?: (response: User) => void) => {
  const queryClient = useQueryClient();
  const { mutate: login, ...rest } = useMutation({
    mutationFn: (data: UserLoginData) =>
      dataExtractionWrapper(
        authenticateUserUserLoginPost({
          body: {
            ...data,
          },
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(getProfileQueryOptions().queryKey, data);
      refreshSubscription({ requestPermissionOnPrompt: true }); // TODO: Почему-то в Edge это не работает - надо понять, почему
      onSuccess?.(data);
    },
  });
  return { login, ...rest };
};
