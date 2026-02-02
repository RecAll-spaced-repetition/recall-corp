import React, { HTMLAttributes, useMemo } from 'react';
import clsx from 'clsx';

const OFFSETS = {
  1: [
    'md:hover:-translate-x-1',
    'md:hover:-translate-y-1',
    'md:hover:before:translate-x-1',
    'md:hover:before:translate-y-1',
  ],
  2: [
    'md:hover:-translate-x-2',
    'md:hover:-translate-y-2',
    'md:hover:before:translate-x-2',
    'md:hover:before:translate-y-2',
  ],
  3: [
    'md:hover:-translate-x-3',
    'md:hover:-translate-y-3',
    'md:hover:before:translate-x-3',
    'md:hover:before:translate-y-3',
  ],
};

export interface ShadowWrapperProps extends HTMLAttributes<React.FC> {
  shadowOffset?: keyof typeof OFFSETS;
  bgClass?: string;
}

export const ShadowWrapper: React.FC<ShadowWrapperProps> = ({
  shadowOffset,
  className,
  bgClass,
  children,
}) => {
  const bgColorClass = useMemo(
    () => (bgClass ? `before:${bgClass}` : 'before:bg-black/50'),
    [bgClass]
  );

  return (
    <div
      className={clsx(
        'relative transition-all duration-200',
        'before:absolute before:full before:rounded-md',
        bgColorClass,
        'before:transition-all before:duration-200',
        OFFSETS[shadowOffset || 1],
        className
      )}
    >
      {children}
    </div>
  );
};
