import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { Button, Input, FormItem } from '@/components/library';
import { useAppStore } from '@/state';
import { useRegister } from '@/query/mutationHooks';

const userRegisterScheme = z
  .object({
    email: z.email({ message: 'auth.invalidEmail' }),
    nickname: z.string({ message: 'auth.nicknameRequired' }),
    password1: z
      .string({ message: 'auth.passwordRequired' })
      .min(8, 'auth.passwordMinLength'),
    password2: z
      .string({ message: 'auth.passwordRepeatRequired' })
      .min(8, 'auth.passwordMinLength'),
  })
  .refine((data) => data.password1 === data.password2, {
    message: 'auth.passwordMismatch',
    path: ['password2'],
  });
export type UserRegisterData = z.infer<typeof userRegisterScheme>;

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const closeAuthWindow = useAppStore((state) => state.closeAuthWindow);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterData>({
    resolver: zodResolver(userRegisterScheme),
  });

  const { registerUser, error } = useRegister(() => {
    closeAuthWindow();
  });

  return (
    <form
      className="vstack center w-full"
      onSubmit={handleSubmit((data) => registerUser(data))}
    >
      <FormItem
        className="vstack mb-2 w-full"
        errorMessage={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              placeholder={t('auth.emailPlaceholder')}
              bottomBorder
              {...field}
            />
          )}
        />
      </FormItem>
      <FormItem
        className="vstack mb-2 w-full"
        errorMessage={errors.nickname?.message}
      >
        <Controller
          name="nickname"
          control={control}
          render={({ field }) => (
            <Input
              placeholder={t('auth.nicknamePlaceholder')}
              bottomBorder
              {...field}
            />
          )}
        />
      </FormItem>
      <FormItem
        className="vstack mb-2 w-full"
        errorMessage={errors.password1?.message}
      >
        <Controller
          name="password1"
          control={control}
          render={({ field }) => (
            <Input
              placeholder={t('auth.createPasswordPlaceholder')}
              bottomBorder
              type="password"
              {...field}
            />
          )}
        />
      </FormItem>
      <FormItem
        className="vstack mb-2 w-full"
        errorMessage={errors.password2?.message}
      >
        <Controller
          name="password2"
          control={control}
          render={({ field }) => (
            <Input
              placeholder={t('auth.repeatPasswordPlaceholder')}
              bottomBorder
              type="password"
              {...field}
            />
          )}
        />
      </FormItem>
      {error && (
        <FormItem className="vstack mb-2 w-full" errorMessage={error.message} />
      )}
      <Button
        variant="plate-blue"
        type="submit"
        className="full text-lg font-medium"
        withShadow
        shadowBoxClassName="w-2/3 mt-1 mb-2"
      >
        {t('common.register')}
      </Button>
    </form>
  );
};
