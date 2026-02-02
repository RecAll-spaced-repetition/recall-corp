import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

import { Icon, IconType, ShadowWrapper } from '@/components/library';

interface IconButtonProps
  extends PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> {
  icon?: IconType;
  loading?: boolean;
  withShadow?: boolean;
  shadowBoxClassName?: string;
  variant?: Variants;
}

export type Variants =
  | 'inline'
  | 'bordered'
  | 'plate-green'
  | 'plate-lime'
  | 'plate-yellow'
  | 'plate-orange'
  | 'plate-blue'
  | 'plate-red';
const variants: Record<Variants, string> = {
  inline: `hover:bg-neutral-300/50 hover:shadow-inner`,
  bordered: `text-black bg-o-white border border-o-black hover:bg-neutral-300/50 hover:shadow-inner`,
  'plate-green': `border border-o-black bg-green-300 text-o-black hover:bg-green-600 hover:shadow-inner hover:text-o-white`,
  'plate-lime': `border border-o-black bg-lime-300 text-o-black hover:bg-lime-600 hover:shadow-inner hover:text-o-white`,
  'plate-yellow': `border border-o-black bg-yellow-200 text-o-black hover:bg-amber-400 hover:shadow-inner hover:text-o-white`,
  'plate-orange': `border border-o-black bg-orange-300 text-o-black hover:bg-orange-600 hover:shadow-inner hover:text-o-white`,
  'plate-blue': `border border-o-black bg-blue-300 text-o-black hover:bg-blue-600 hover:shadow-inner hover:text-o-white`,
  'plate-red': `border border-o-black bg-red-300 text-o-black hover:bg-red-500 hover:shadow-inner hover:text-o-white`,
};
export const Button: React.FC<IconButtonProps> = ({
  variant,
  loading,
  icon,
  className,
  children,
  withShadow,
  shadowBoxClassName,
  ...rest
}) => {
  const button = (
    <button
      type={'button'}
      className={clsx(
        variants[variant || 'inline'],
        withShadow && 'full relative',
        'center rounded-md',
        'min-w-[16px] min-h-[16px] md:min-w-[32px] md:min-h-[32px]',
        'space-x-2 p-1 md:p-2 transition-all duration-200',
        'cursor-pointer disabled:cursor-not-allowed',
        className
      )}
      disabled={loading}
      {...rest}
    >
      {icon && !loading && (
        <Icon icon={icon} className={children ? 'mr-2' : ''} />
      )}
      {loading && (
        <Icon
          icon={'loading-3/4'}
          className={`${children ? 'mr-2' : ''} animate-spin`}
        />
      )}
      {children}
    </button>
  );

  return withShadow ? (
    <ShadowWrapper className={clsx(shadowBoxClassName)}>{button}</ShadowWrapper>
  ) : (
    button
  );
};
