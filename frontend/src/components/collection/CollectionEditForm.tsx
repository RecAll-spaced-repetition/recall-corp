import React from 'react';
import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormItem,
  LoadableComponent,
  Input,
} from '@/components/library';
import { useCollection } from '@/query/queryHooks';
import {
  useCollectionDelete,
  useCollectionUpdate,
} from '@/query/mutationHooks';
import { CollectionEditType, collectionScheme } from './CreateCollectionWindow';
import { routes } from '@/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/library/shadcn-ui';
import { useLocation } from 'wouter';
import { useCollectionPublicityUpdate } from '@/query/mutationHooks/useCollectionPublicityUpdate';

export type CollectionType = CollectionEditType & {
  id: number;
};

export interface CollectionEditFormProps {
  id: number;
}

export const CollectionEditForm: React.FC<CollectionEditFormProps> = ({
  id,
}) => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const {
    collection,
    error: collectionError,
    isPending: isCollectionPending,
  } = useCollection(id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CollectionEditType>({
    resolver: zodResolver(collectionScheme),
  });

  const {
    updateCollection,
    error: updateError,
    isPending: isUpdatePending,
  } = useCollectionUpdate(id, () => {
    setLocation(routes.collectionView.getUrl(id));
  });
  const {
    updateCollectionPublicity,
    error: publicityError,
    isPending: isPublicityPending,
  } = useCollectionPublicityUpdate(id, () => {
    setLocation(routes.collectionView.getUrl(id));
  });
  const {
    deleteCollection,
    error: deleteError,
    isPending: isDeletePending,
  } = useCollectionDelete(id, () => {
    setLocation(routes.collections.getUrl());
  });

  const isAnyPending =
    isCollectionPending ||
    isUpdatePending ||
    isPublicityPending ||
    isDeletePending;

  return (
    <LoadableComponent
      isPending={isCollectionPending}
      errorMessage={collectionError?.message}
    >
      <form
        className="my-2 md:my-6"
        onSubmit={handleSubmit((data) => updateCollection(data))}
      >
        <FormItem className="m-2 md:m-4" errorMessage={errors.title?.message}>
          {collection && (
            <Controller
              name="title"
              control={control}
              defaultValue={collection.title}
              render={({ field }) => (
                <Input
                  className={clsx(
                    'text-center font-black',
                    'text-lg md:text-xl lg:text-2xl xl:text-4xl'
                  )}
                  placeholder={t('collection.titlePlaceholder')}
                  id="title"
                  {...field}
                />
              )}
            />
          )}
        </FormItem>
        <FormItem
          className="m-2 md:m-4"
          errorMessage={errors.description?.message}
        >
          {collection && (
            <textarea
              className={clsx(
                'p-1 md:p-2 w-full',
                'text-center text-o-black font-medium',
                'text-base md:text-lg lg:text-xl xl:text-3xl',
                'bg-transparent resize-none',
                'focus:outline-none',
                'transition-all duration-200',
                'hover:shadow-inner hover:shadow-neutral-400',
                'focus:shadow-inner hover:shadow-neutral-400'
              )}
              placeholder={t('collection.descriptionPlaceholder')}
              id="description"
              defaultValue={
                collection.description === null ? '' : collection.description
              }
              {...register('description')}
            />
          )}
        </FormItem>
        <FormItem
          className="m-2 md:m-4 text-lg"
          errorMessage={
            updateError?.message ||
            publicityError?.message ||
            deleteError?.message
          }
        />
        <div
          className={clsx(
            'mt-2 md:m-2',
            'w-full center gap-x-2',
            'text-lg md:text-xl'
          )}
        >
          <Button
            variant="plate-green"
            type="submit"
            withShadow
            className="p-2 md:p-3"
            title={t('common.saveChanges')}
            loading={isAnyPending}
            icon="save"
          />
          <DropdownMenu>
            <DropdownMenuTrigger disabled={isAnyPending}>
              {collection && (
                <Button
                  variant="plate-yellow"
                  className="p-2 md:p-3"
                  title={t(
                    collection.isPublic
                      ? 'collection.private'
                      : 'collection.public'
                  )}
                  loading={isAnyPending}
                  icon={collection.isPublic ? 'lock' : 'open'}
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={clsx(
                'w-screen md:w-fit',
                'vstack center gap-y-2 p-2',
                'bg-o-white border border-o-black rounded-lg'
              )}
            >
              {collection && (
                <>
                  <span>
                    {t(
                      collection.isPublic
                        ? 'collection.privateAlert'
                        : 'collection.publicAlert'
                    )}
                  </span>
                  <DropdownMenuItem>
                    <Button
                      variant="plate-yellow"
                      onClick={() =>
                        updateCollectionPublicity(!collection.isPublic)
                      }
                      className="p-2 md:p-3"
                      title={t(
                        collection.isPublic
                          ? 'collection.private'
                          : 'collection.public'
                      )}
                      loading={isAnyPending}
                      icon={collection.isPublic ? 'lock' : 'open'}
                    />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger disabled={isAnyPending}>
              <Button
                variant="bordered"
                className="p-2 md:p-3"
                title={t('collection.deleteButton')}
                icon="trash"
                loading={isAnyPending}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button
                  variant="plate-red"
                  onClick={() => deleteCollection()}
                  title={t('common.confirmDeletion')}
                >
                  {t('common.confirmDeletion')}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </form>
    </LoadableComponent>
  );
};
