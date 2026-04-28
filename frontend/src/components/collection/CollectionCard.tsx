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
import {
  useCollection,
  useProfile,
  useProfileSubscriptions,
  useTrainCollectionWhen,
} from '@/query/queryHooks';
import { useAppStore } from '@/state';
import clsx from 'clsx';
import {
  useCollectionSubscribe,
  useCollectionUnsubscribe,
} from '@/query/mutationHooks';

interface CollectionCardProps {
  collectionId: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collectionId,
}) => {
  const { t } = useTranslation();

  const { collection, isPending, error } = useCollection(collectionId);
  const { trainWhen } = useTrainCollectionWhen(collectionId);
  const { profile } = useProfile();
  const { collections } = useProfileSubscriptions();

  const isSubscribed =
    collection && collections?.some((sub) => sub.id === collection.id);

  const { subscribe, isPending: subscribePending } =
    useCollectionSubscribe(collectionId);
  const { unsubscribe, isPending: unsubscribePending } =
    useCollectionUnsubscribe(collectionId);
  const showAuthWindow = useAppStore((state) => state.showLoginWindow);

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
                <Button
                  variant={isSubscribed ? 'plate-yellow' : 'bordered'}
                  className="p-1 text-xs md:text-lg size-7 md:size-5"
                  title={
                    isSubscribed
                      ? t('collection.unsubscribe')
                      : t('collection.subscribe')
                  }
                  onClick={() => (isSubscribed ? unsubscribe() : subscribe())}
                >
                  {subscribePending || unsubscribePending ? (
                    <Icon className="animate-spin" icon="loading-3/4" />
                  ) : (
                    <Icon icon={isSubscribed ? 'star-fill' : 'star'} />
                  )}
                </Button>
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
                {profile ? (
                  <>
                    {trainWhen?.when.type === 'now' && (
                      <Link to={routes.train.getUrl(collectionId)}>
                        <Button
                          variant="plate-green"
                          className={clsx('py-1 px-4')}
                          withShadow
                          title={t('collection.trainButton')}
                        >
                          {t('collection.trainButton')}
                        </Button>
                      </Link>
                    )}
                    {trainWhen?.when.type === 'due' && (
                      <p className="text-md mb-2">
                        {t('collection.trainDue', {
                          date: new Date(trainWhen.when.due).toLocaleString(),
                        })}
                      </p>
                    )}
                  </>
                ) : (
                  <Button
                    variant="plate-green"
                    className="py-1 px-4"
                    onClick={showAuthWindow}
                    withShadow
                    title={t('collection.trainButton')}
                  >
                    {t('collection.trainButton')}
                  </Button>
                )}
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
          </>
        )}
      </div>
    </LoadableComponent>
  );
};
