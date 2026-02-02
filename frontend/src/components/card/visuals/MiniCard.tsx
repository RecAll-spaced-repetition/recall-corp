import { ShadowWrapper } from '@/components/library';
import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

interface MiniCardProps extends HTMLAttributes<React.FC> {
  onClick?: () => void;
  shadowOff?: boolean;
}

export const MiniCard: React.FC<MiniCardProps> = ({
  onClick,
  className,
  children,
  shadowOff,
}) => {
  const card = (
    <div
      className={clsx(
        'transition-all duration-200',
        'overflow-hidden relative',
        'px-4 py-2 w-full h-56 md:h-48 center rounded-lg',
        'ring-1 ring-o-black',
        'hover:cursor-pointer',
        className
      )}
      onClick={() => onClick?.()}
    >
      {children}
    </div>
  );

  if (shadowOff) return card;

  return <ShadowWrapper shadowOffset={2}>{card}</ShadowWrapper>;
};
