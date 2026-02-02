import React from 'react';

import { LoadableComponent } from '@/components/library';
import { useProfileFiles } from '@/query/queryHooks';
import { FileCard } from './FileCard';
import { useTranslation } from 'react-i18next';

export const FilesList: React.FC = () => {
  const { t } = useTranslation();
  const { files, isPending: isFilesPending, error } = useProfileFiles();

  return (
    <LoadableComponent
      isPending={isFilesPending}
      errorMessage={error?.message}
      animated
    >
      {files && files.length === 0 && (
        <h3 className="text-center text-xl font-medium col-span-full">
          {t('profile.emptyFilesList')}
        </h3>
      )}
      <div
        className="w-full grid align-center justify-center gap-4"
        style={{
          gridTemplateColumns: 'repeat( auto-fit, minmax(300px, 1fr))',
        }}
      >
        {files &&
          files.length > 0 &&
          files?.map((id) => <FileCard key={id} fileId={id} />)}
      </div>
    </LoadableComponent>
  );
};
