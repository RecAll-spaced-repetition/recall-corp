import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { CustomTKeys } from '@/i18n';

interface FormItemProps extends HTMLAttributes<React.FC> {
  labelComponent?: React.JSX.Element;
  errorMessage?: string | CustomTKeys;
}

export const FormItem: React.FC<FormItemProps> = ({
  labelComponent,
  errorMessage,
  className,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className={clsx(className)}>
      {labelComponent}
      {children}
      {errorMessage && (
        <span className="text-red-500 font-bold text-center m-1 p-2 rounded-md">
          {t(errorMessage as CustomTKeys, { defaultValue: errorMessage })}
        </span>
      )}
    </div>
  );
};
