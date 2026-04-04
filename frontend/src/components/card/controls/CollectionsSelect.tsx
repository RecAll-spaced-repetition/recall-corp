import React from 'react';
import { IsPublicIcon, LoadableComponent } from '@/components/library';
import Select, { MultiValue } from 'react-select';

import { useProfileCollections } from '@/query/queryHooks';
import { CollectionShort } from '@/api';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/state';

export type Option<V> = { value: V; label: React.JSX.Element };

export const collectionResponseToOptions = (collections?: CollectionShort[]) =>
  collections?.map((collection) => ({
    value: collection.id,
    label: (
      <span className="gap-x-1 around md:justify-start items-center">
        {collection.title}
        <IsPublicIcon objectType="collection" isPublic={collection.isPublic} />
      </span>
    ),
  })) ?? [];

export interface CollectionsSelectProps {
  selectedOptions: MultiValue<Option<number>>;
  setSelectedOptions: (options: MultiValue<Option<number>>) => void;
}

export const CollectionsSelect: React.FC<CollectionsSelectProps> = ({
  selectedOptions,
  setSelectedOptions,
}) => {
  const { t } = useTranslation();

  const switchOnChangedFlag = useAppStore((state) => state.switchOnChangedFlag);

  const { collections, isPending: collectionsPending } =
    useProfileCollections();

  return (
    <LoadableComponent
      isPending={collectionsPending}
      className="vstack w-full p-1 md:p-2"
      animated
    >
      <Select
        unstyled
        classNames={{
          placeholder: () => 'text-neutral-500/75',
          container: () => 'w-full',
          control: () =>
            'bg-o-white hover:shadow-inner hover:shadow-neutral-400 px-1',
          valueContainer: () => 'p-1 gap-1',
          multiValue: () => 'bg-blue-200/75 px-1 center',
          multiValueRemove: () =>
            'ml-1 cursor-pointer rounded-xs transition-all duration-400 hover:bg-neutral-300/50',
          menuList: () =>
            'bg-o-white border border-black my-1 p-1 divide-y-2 divide-neutral-300 opacity',
          option: () => 'px-2 py-1 hover:bg-blue-200/50 active:',
          dropdownIndicator: () =>
            'mx-2 cursor-pointer rounded-xs transition-all duration-400 hover:bg-neutral-300/50',
        }}
        isMulti
        isSearchable
        isClearable={false}
        defaultMenuIsOpen={false}
        closeMenuOnSelect={true}
        maxMenuHeight={100}
        placeholder={t('card.pairedWithPlaceholder')}
        options={collectionResponseToOptions(collections)}
        value={selectedOptions}
        onChange={(options) => {
          setSelectedOptions(options);
          switchOnChangedFlag();
        }}
      />
      <p>{t('card.selectPublicityAlert')}</p>
    </LoadableComponent>
  );
};
