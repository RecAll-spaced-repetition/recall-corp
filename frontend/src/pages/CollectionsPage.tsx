import React from 'react';

import { useCollections } from '@/query/queryHooks';
import { CollectionsSearchableList } from '@/components/collection';
import { LoadableComponent } from '@/components/library';
import { useTranslation } from 'react-i18next';

export const CollectionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { collections, isPending, error } = useCollections();

  return (
    <div className="flex flex-col items-center text-o-black">
      <h1 className="text-center text-2xl font-bold mb-6">
        {t('common.collections')}
      </h1>

      <LoadableComponent isPending={isPending} errorMessage={error?.message}>
        {collections && <CollectionsSearchableList collections={collections} />}
      </LoadableComponent>
    </div>
  );
};
