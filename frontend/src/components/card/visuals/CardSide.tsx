import clsx from 'clsx';
import React, { PropsWithChildren, HTMLAttributes } from 'react';

type CardSides = 'front' | 'back';
interface CardSideProps extends PropsWithChildren<HTMLAttributes<React.FC>> {
  side: CardSides;
}

const animationClasses = {
  front: 'flip-front',
  back: 'flip-back',
} satisfies Record<CardSides, string>;

export const CardSide: React.FC<CardSideProps> = ({
  side,
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        'overflow-scroll-y full',
        animationClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
};
