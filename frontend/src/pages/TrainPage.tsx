import React, { useCallback, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { useShallow } from 'zustand/react/shallow';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/state';
import { routes } from '@/routes';
import { Button, LoadableComponent, ProgressBar } from '@/components/library';
import { CardsList } from '@/components/card';
import {
  useCollection,
  useProfile,
  getCollectionTrainCardsQueryOptions,
  useCollectionTrainCards,
} from '@/query/queryHooks';
import { ErrorPage } from './ErrorPage';

export interface TrainPageParams {
  id: number;
}

export const TrainPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<TrainPageParams>();

  const { profile } = useProfile();
  const {
    collection,
    isPending: isCollectionPending,
    error: collectionError,
  } = useCollection(id);
  const {
    cards,
    isPending: isTrainCardsPending,
    error: trainCardsError,
  } = useCollectionTrainCards(id);

  const cardsIds = useAppStore(useShallow((state) => state.cardsToTrainIds));
  const setTrainCards = useAppStore((state) => state.setTrainCards);
  const maxCount = useAppStore((state) => state.cardsToTrainInitialCount);
  const trainedCount = useAppStore((state) => state.trainedCount);

  const client = useQueryClient();
  const refreshTrainCards = useCallback(() => {
    client.invalidateQueries({
      queryKey: getCollectionTrainCardsQueryOptions(id).queryKey,
    });
  }, [client, id]);

  useEffect(() => {
    setTrainCards(cards ?? []);
  }, [cards, setTrainCards]);

  if (!profile)
    return (
      <ErrorPage
        isPending={isCollectionPending || isTrainCardsPending}
        message={t('train.onlyAuthorized')}
      />
    );

  return (
    <LoadableComponent
      isPending={isCollectionPending || isTrainCardsPending}
      errorMessage={collectionError?.message || trainCardsError?.message}
      animated
    >
      <div className="vstack">
        <h1 className="my-2 text-center text-2xl font-bold">
          {t('train.training')} {collection?.title}
        </h1>
        {maxCount === 0 && (
          <>
            <h2 className="text-center text-xl my-2">{t('train.noCards')}</h2>
            <h2 className="text-center text-xl my-2">
              {t('train.chillOrTrain')}
            </h2>
            <div className="vstack md:center">
              <Link
                className="my-2 md:m-2 w-full md:w-1/3"
                to={routes.collections.getUrl()}
              >
                <Button
                  className="w-full font-medium text-lg"
                  variant="plate-green"
                  withShadow
                  title={t('train.goToCollections')}
                >
                  {t('train.goToCollections')}
                </Button>
              </Link>
            </div>
          </>
        )}
        {maxCount > 0 && trainedCount >= maxCount && (
          <>
            <h2 className="text-center text-2xl my-2">
              {t('train.congratulations')}
            </h2>
            <div className="xs-md:vstack md:center">
              <Link
                className="w-full md:w-1/4"
                to={routes.collections.getUrl()}
              >
                <Button
                  className="w-full font-medium text-lg"
                  variant="plate-yellow"
                  withShadow
                  title={t('train.goToCollections')}
                >
                  {t('train.goToCollections')}
                </Button>
              </Link>
              <Button
                className="font-medium text-lg full"
                variant="plate-green"
                onClick={refreshTrainCards}
                withShadow
                shadowBoxClassName="my-2 md:m-2 w-full md:w-1/4 "
                title={t('train.trainAgain')}
              >
                {t('train.trainAgain')}
              </Button>
            </div>
          </>
        )}
        {maxCount > 0 && trainedCount < maxCount && (
          <>
            <ProgressBar
              className="my-4 border-2 text-xl font-medium"
              value={trainedCount}
              minValue={0}
              maxValue={maxCount}
            />
            <div className="center">
              <Button
                className="p-1 md:p-2 text-lg"
                variant="plate-yellow"
                onClick={refreshTrainCards}
                withShadow
                title={t('train.refreshCards')}
              >
                {t('train.refreshCards')}
              </Button>
            </div>
            <CardsList
              className="mt-4 md:mt-8"
              cardsIds={cardsIds.slice(0, 6)}
              mode="train"
            />
          </>
        )}
      </div>
    </LoadableComponent>
  );
};
