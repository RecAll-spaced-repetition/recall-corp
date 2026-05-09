import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

import { routes } from '@/routes';
import {
  LoadableComponent,
  Button,
  Icon,
  IsPublicIcon,
} from '@/components/library';
import { useCollection, useProfile } from '@/query/queryHooks';
import clsx from 'clsx';
import { CollectionSubscriptionButton } from './CollectionSubscriptionButton';
import { CollectionTrainButton } from './CollectionTrainButton';
import { CollectionProgressBar } from './CollectionProgressBar';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface CollectionCardProps {
  collectionId: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collectionId,
}) => {
  const { t } = useTranslation();

  const { collection, isPending, error } = useCollection(collectionId);
  const { profile } = useProfile();

  return (
    <LoadableComponent isPending={isPending} errorMessage={error?.message}>
      <div
        className={clsx(
          'bg-o-white-max text-o-black',
          'p-6 m-2 rounded-lg',
          'ring-1 ring-o-black'
        )}
      >
        {collection && (
          <>
            <div>
              <h2
                className={clsx(
                  'mb-2 gap-x-2',
                  'flex items-center justify-between',
                  'text-lg font-bold'
                )}
              >
                <CollectionSubscriptionButton collectionId={collectionId} />
                <span>{collection.title}</span>
                <IsPublicIcon
                  objectType="collection"
                  isPublic={collection.isPublic}
                />
              </h2>
              <p className="text-md mb-2">{collection.description}</p>
            </div>

            <div className="flex gap-x-2 items-center justify-between mt-4">
              <div className="flex justify-start gap-x-2">
                <CollectionTrainButton collectionId={collectionId} />
              </div>

              <div className="flex justify-end gap-x-2">
                <Link to={routes.collectionView.getUrl(collectionId)}>
                  <Button
                    variant="plate-blue"
                    className="p-2 md:p-3"
                    withShadow
                    title={t('common.view')}
                  >
                    <Icon icon="eye" />
                  </Button>
                </Link>
                {collection.ownerId === profile?.id && (
                  <Link to={routes.collectionEdit.getUrl(collectionId)}>
                    <Button
                      variant="plate-yellow"
                      className="p-2 md:p-3"
                      withShadow
                      title={t('common.edit')}
                    >
                      <Icon icon="editor" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {profile && (
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-start items-center gap-1">
                  <p>{t('collection.progress')}</p>
                  <Menu>
                    <MenuButton as={Button} variant="inline" icon="info" />
                    <MenuItems anchor={{ to: 'bottom', gap: 2 }}>
                      <MenuItem>
                        <p className="m-1 p-2 bg-o-white border border-o-black rounded-xl">
                          {t('collection.progressInfo')}
                        </p>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
                <CollectionProgressBar collectionId={collectionId} />
              </div>
            )}
          </>
        )}
      </div>
    </LoadableComponent>
  );
};
