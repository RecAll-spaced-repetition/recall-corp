import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getProfileQueryOptions } from '@/query/queryHooks';
import { createUserUserRegisterPost, User } from '@/api';
import { UserRegisterData } from '@/components/auth/RegisterForm';

export const useRegister = (onSuccess?: (response: User) => void) => {
  const queryClient = useQueryClient();
  const { mutate: registerUser, ...rest } = useMutation({
    mutationFn: (data: UserRegisterData) =>
      dataExtractionWrapper(
        createUserUserRegisterPost({
          body: {
            email: data.email,
            nickname: data.nickname,
            password: data.password1,
          },
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(getProfileQueryOptions().queryKey, data);
      onSuccess?.(data);
    },
  });
  return { registerUser, ...rest };
};
