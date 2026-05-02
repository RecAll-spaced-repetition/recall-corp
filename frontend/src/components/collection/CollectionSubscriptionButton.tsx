import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Icon } from '@/components/library';
import {
  useCollection,
  useProfile,
  useProfileSubscriptions,
} from '@/query/queryHooks';
import { useAppStore } from '@/state';
import {
  useCollectionSubscribe,
  useCollectionUnsubscribe,
} from '@/query/mutationHooks';
import clsx from 'clsx';

type CollectionSubscriptionButtonProps = {
  collectionId: number;
  className?: string;
};

export const CollectionSubscriptionButton: React.FC<
  CollectionSubscriptionButtonProps
> = ({ collectionId, className }) => {
  const { t } = useTranslation();

  const { collection } = useCollection(collectionId);
  const { profile } = useProfile();
  const { collections } = useProfileSubscriptions();

  const isSubscribed =
    !!profile &&
    !!collection &&
    collections?.some((sub) => sub.id === collection.id);

  const { subscribe, isPending: subscribePending } =
    useCollectionSubscribe(collectionId);
  const { unsubscribe, isPending: unsubscribePending } =
    useCollectionUnsubscribe(collectionId);
  const showAuthWindow = useAppStore((state) => state.showLoginWindow);

  const clickAction = useCallback(() => {
    if (!profile) {
      showAuthWindow();
      return;
    }
    if (isSubscribed) unsubscribe();
    else subscribe();
  }, [profile, isSubscribed]);

  return (
    <Button
      variant={isSubscribed ? 'plate-yellow' : 'bordered'}
      className={clsx('p-1 text-xs md:text-lg size-7 md:size-5', className)}
      title={
        isSubscribed ? t('collection.unsubscribe') : t('collection.subscribe')
      }
      onClick={clickAction}
    >
      {subscribePending || unsubscribePending ? (
        <Icon className="animate-spin" icon="loading-3/4" />
      ) : (
        <Icon icon={isSubscribed ? 'star-fill' : 'star'} />
      )}
    </Button>
  );
};
