import { getFileFullPath, useFileMeta } from '@/query/queryHooks';
import React, { HTMLAttributes } from 'react';
import { Button, IsPublicIcon, LoadableComponent } from '@/components/library';
import clsx from 'clsx';
import { useFileDelete } from '@/query/mutationHooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../library/shadcn-ui';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';
import { getMediaTypedUrl } from '../editor';

interface FileCardProps extends HTMLAttributes<React.FC> {
  fileId: number;
}

export const FileCard: React.FC<FileCardProps> = ({ fileId, className }) => {
  const { t } = useTranslation();

  const { fileMeta, isPending, error } = useFileMeta(fileId);
  const { deleteFile, isPending: isDeletePending } = useFileDelete(fileId);

  return (
    <LoadableComponent
      isPending={isPending}
      errorMessage={error?.message}
      className={clsx(
        'bg-neutral-300/25 px-2 py-4',
        'grid grid-cols-4',
        'gap-y-2 gap-x-4 rounded-lg',
        className
      )}
      animated
    >
      {fileMeta && (
        <>
          <div className="col-span-4 center">
            {match(fileMeta.type)
              .with('image', () => <img src={getFileFullPath(fileId)} />)
              .with('video', () => (
                <video controls src={getFileFullPath(fileId)} />
              ))
              .with('audio', () => (
                <audio controls src={getFileFullPath(fileId)} />
              ))
              .exhaustive()}
          </div>
          <div className="col-span-4 md:col-span-3 gap-x-1 center">
            <Button
              className="mx-1"
              variant="bordered"
              title={t('file.copy')}
              onClick={() => {
                navigator.clipboard.writeText(
                  `![ ... ](${getMediaTypedUrl(fileMeta)})`
                );
              }}
            >
              {t('common.copy')}
            </Button>
            <IsPublicIcon objectType="file" isPublic={fileMeta.isPublic} />
          </div>
          <div className="col-span-4 md:col-span-1 center">
            <DropdownMenu>
              <DropdownMenuTrigger disabled={isDeletePending}>
                <Button
                  className="text-xl"
                  variant="bordered"
                  title={t('file.deleteFile')}
                  loading={isDeletePending}
                  icon="trash"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button
                    variant="plate-red"
                    onClick={() => deleteFile()}
                    title={t('common.confirmDeletion')}
                  >
                    {t('common.confirmDeletion')}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </LoadableComponent>
  );
};
