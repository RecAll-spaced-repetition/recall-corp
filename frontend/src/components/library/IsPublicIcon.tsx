import React from 'react';

import { Icon, IconProps } from './Icon';
import { match } from 'ts-pattern';
import { useTranslation } from 'react-i18next';

export interface IsPublicIconProps extends Omit<IconProps, 'icon'> {
  isPublic?: boolean;
  objectType: 'collection' | 'card' | 'file';
}

export const IsPublicIcon: React.FC<IsPublicIconProps> = ({
  isPublic,
  objectType,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Icon
      title={match(objectType)
        .with('collection', () =>
          t(isPublic ? 'collection.thisPublic' : 'collection.thisPrivate')
        )
        .with('card', () =>
          t(isPublic ? 'card.thisPublic' : 'card.thisPrivate')
        )
        .with('file', () =>
          t(isPublic ? 'file.thisPublic' : 'file.thisPrivate')
        )
        .exhaustive()}
      icon={isPublic ? 'open' : 'lock'}
      {...props}
    />
  );
};
