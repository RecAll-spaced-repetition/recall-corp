import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

import { CardSide } from './CardSide';

interface StaticFlippingCardProps extends HTMLAttributes<HTMLDivElement> {
  frontSide: React.JSX.Element;
  backSide: React.JSX.Element;
  flipped: boolean | 'hover';
}

export const StaticFlippingCard: React.FC<StaticFlippingCardProps> = ({
  className,
  frontSide,
  backSide,
  flipped,
}) => {
  return (
    <div
      className={clsx(
        'transition-all duration-500 flip-inner',
        flipped && 'animate-flip',
        className
      )}
    >
      <CardSide side="front">{frontSide}</CardSide>
      <CardSide side="back">{backSide}</CardSide>
    </div>
  );
};
