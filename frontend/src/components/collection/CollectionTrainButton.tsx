import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { routes } from '@/routes';
import { Button } from '@/components/library';
import { useProfile, useTrainCollectionWhen } from '@/query/queryHooks';
import { useAppStore } from '@/state';

type CollectionCollectionTrainButtonProps = {
  collectionId: number;
  btnClassname?: string;
  dueClassname?: string;
};

export const CollectionTrainButton: React.FC<
  CollectionCollectionTrainButtonProps
> = ({ collectionId, btnClassname, dueClassname }) => {
  const { t } = useTranslation();

  const { trainWhen } = useTrainCollectionWhen(collectionId);
  const { profile } = useProfile();

  const showAuthWindow = useAppStore((state) => state.showLoginWindow);

  if (!profile)
    return (
      <Button
        variant="plate-green"
        className={clsx('py-1 px-4', btnClassname)}
        onClick={showAuthWindow}
        withShadow
        title={t('collection.trainButton')}
      >
        {t('collection.trainButton')}
      </Button>
    );

  if (trainWhen?.when.type === 'now')
    return (
      <Link to={routes.train.getUrl(collectionId)}>
        <Button
          variant="plate-green"
          className={clsx('py-1 px-4', btnClassname)}
          withShadow
          title={t('collection.trainButton')}
        >
          {t('collection.trainButton')}
        </Button>
      </Link>
    );

  if (trainWhen?.when.type === 'due')
    return (
      <p className={clsx('text-md mb-2', dueClassname)}>
        {t('collection.trainDue', {
          date: new Date(trainWhen.when.due).toLocaleString(),
        })}
      </p>
    );
};
