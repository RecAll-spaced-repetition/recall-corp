import React, { HTMLAttributes } from 'react';
import { Icon } from './Icon';
import clsx from 'clsx';

interface LoadableComponentProps extends HTMLAttributes<React.FC> {
  isPending?: boolean;
  errorMessage?: string;
  animated?: boolean;
}

export const LoadableComponent: React.FC<LoadableComponentProps> = ({
  isPending,
  errorMessage,
  animated,
  className,
  children,
}) => {
  return (
    <>
      {isPending && (
        <div className="w-full center m-1 p-2">
          <Icon className="animate-spin" icon="loading-3/4" />
        </div>
      )}
      {errorMessage && (
        <span className="text-red-500 font-bold text-center m-1 p-2">
          {errorMessage}
        </span>
      )}
      {animated && (
        <div
          className={clsx(
            'trainsition-all duration-300',
            isPending || errorMessage ? 'invisible opacity-0' : 'opacity-100',
            className
          )}
        >
          {children}
        </div>
      )}
      {!animated && !isPending && !errorMessage && children}
    </>
  );
};
