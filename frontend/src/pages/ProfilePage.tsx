import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, LoadableComponent } from '@/components/library';
import {
  useProfile,
  useProfileCollections,
  useProfileSubscriptions,
} from '@/query/queryHooks';
import { ErrorPage } from './ErrorPage';
import { FilesList } from '@/components/files';
import { CollectionsSearchableList } from '@/components/collection';
import { useProfileDelete } from '@/query/mutationHooks';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Stats, TrainsCalendar } from '@/components/stats';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { profile, isPending: isProfilePending } = useProfile();
  const { collections, isPending: isCollectionsPending } =
    useProfileCollections();
  const { collections: subscriptions, isPending: isSubscriptionsPending } =
    useProfileSubscriptions();

  const { deleteProfile, isPending: isDeletePending } = useProfileDelete();

  if (!profile)
    return (
      <ErrorPage
        isPending={isProfilePending}
        message={t('profile.onlyAuthorized')}
      />
    );

  return (
    <LoadableComponent
      className="flex flex-col items-center"
      isPending={
        isProfilePending || isCollectionsPending || isSubscriptionsPending
      }
      animated
    >
      <h1 className="text-center text-2xl font-bold mb-4">
        {t('startPage.hello')}, {profile?.nickname}!
      </h1>

      <h2 className="text-center text-2xl font-bold mt-8 mb-4">
        {t('profile.mySubscriptions')}
      </h2>

      {subscriptions && <TrainsCalendar collections={subscriptions} />}

      <h2 className="text-center text-2xl font-bold mt-8 mb-4">
        {t('profile.stats')}
      </h2>

      <Stats />

      <h2 className="text-center text-2xl font-bold mt-8 mb-4">
        {t('profile.myCollections')}
      </h2>

      {collections && <CollectionsSearchableList collections={collections} />}

      <h2 className="text-center text-2xl font-bold mt-8 mb-4">
        {t('profile.myFiles')}
      </h2>

      <FilesList />

      <Menu>
        <MenuButton
          as={Button}
          className="mt-16"
          disabled={isDeletePending}
          variant="bordered"
          title={t('profile.deleteAccount')}
          loading={isDeletePending}
        >
          {t('profile.deleteAccount')}
        </MenuButton>
        <MenuItems anchor={{ to: 'bottom', gap: 2 }}>
          <MenuItem>
            <Button
              variant="plate-red"
              onClick={() => deleteProfile()}
              title={t('common.confirmDeletion')}
            >
              {t('common.confirmDeletion')}
            </Button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </LoadableComponent>
  );
};
