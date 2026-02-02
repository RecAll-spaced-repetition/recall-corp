import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

export interface ProgressBarProps extends HTMLAttributes<React.FC> {
  value: number;
  minValue: number;
  maxValue: number;
  fillClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  minValue,
  maxValue,
  className,
  fillClassName,
}) => {
  return (
    <div
      className={clsx(
        'relative m-1 overflow-hidden',
        'border border-black',
        className
      )}
    >
      <div
        className={clsx(
          'absolute bg-green-300 h-full',
          'trainsition-all duration-500',
          fillClassName
        )}
        style={{
          width: `${((value - minValue) / (maxValue - minValue)) * 100}%`,
        }}
      ></div>
      <div className="absolute h-full w-full text-center">
        <span className="m-1">{value}</span>
        <span className="m-1">{'/'}</span>
        <span className="m-1">{maxValue}</span>
      </div>
      <span className="invisible">.</span>
    </div>
  );
};
