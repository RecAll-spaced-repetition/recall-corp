import React from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/src/zod';
import { navigate } from 'wouter/use-browser-location';
import { useTranslation } from 'react-i18next';

import { Button, FormItem, Input, ControlledModal } from '@/components/library';
import { useAppStore } from '@/state';
import clsx from 'clsx';
import { routes } from '@/routes';
import { useCollectionCreate } from '@/query/mutationHooks';

export const collectionScheme = z.object({
  title: z
    .string({ message: 'collection.titleRequired' })
    .min(1, 'collection.titleRequired'),
  description: z.string(),
});
export type CollectionEditType = z.infer<typeof collectionScheme>;

export const CreateCollectionWindow: React.FC = () => {
  const { t } = useTranslation();
  const isOpened = useAppStore((state) => state.isCreateCollectionWindowOpened);
  const setIsOpened = useAppStore(
    (state) => state.setIsCreateCollectionWindowOpened
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CollectionEditType>({
    resolver: zodResolver(collectionScheme),
  });

  const { createCollection, error, isPending } = useCollectionCreate((data) => {
    navigate(routes.collectionEdit.getUrl(data.id), { replace: true });
    setIsOpened(false);
  });

  return (
    <ControlledModal
      isShown={isOpened}
      close={() => setIsOpened(false)}
      contentClassName={clsx(
        'bg-o-white border border-o-black p-1 md:p-3',
        'w-11/12 md:w-1/2 lg:w-1/3'
      )}
    >
      <h2 className="text-xl font-medium text-center">
        {t('collection.creationTitle')}
      </h2>
      <form onSubmit={handleSubmit((data) => createCollection(data))}>
        <FormItem
          className="m-2 md:m-4 text-xl md:text-2xl"
          errorMessage={errors.title?.message}
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                placeholder={t('collection.titlePlaceholder')}
                id="title"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          className="m-2 md:m-4 text-lg"
          errorMessage={errors.description?.message}
        >
          <textarea
            className={clsx(
              'p-1 md:p-2 w-full h-24 lg:h-32',
              'bg-transparent resize-none',
              'text-o-black focus:outline-none',
              'transition-all duration-200'
            )}
            placeholder={t('collection.descriptionPlaceholder')}
            id="description"
            {...register('description')}
          />
        </FormItem>
        {error?.message && (
          <FormItem
            className="m-2 md:m-4 text-lg"
            errorMessage={error?.message}
          />
        )}
        <div className="w-full center">
          <Button
            variant="plate-green"
            type="submit"
            withShadow
            shadowBoxClassName="w-2/3 md:w-1/3"
            title={t('collection.createButton')}
            loading={isPending}
          >
            {t('common.create')}
          </Button>
        </div>
      </form>
    </ControlledModal>
  );
};
