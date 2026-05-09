import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';

export interface ProgressBarProps extends HTMLAttributes<React.FC> {
  value: number;
  valuePostfix?: string;
  hideValue?: boolean;

  minValue: number;

  maxValue: number;
  maxValuePostfix?: string;
  hideMaxValue?: boolean;

  fillClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  valuePostfix,
  hideValue,

  minValue,

  maxValue,
  maxValuePostfix,
  hideMaxValue,

  className,
  fillClassName,
}) => {
  return (
    <div
      className={clsx(
        'relative overflow-hidden',
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
          width: `${Math.max(Math.min((value - minValue) / (maxValue - minValue), 1), 0) * 100}%`,
        }}
      ></div>
      <div className="absolute h-full w-full text-center">
        {!hideValue && (
          <span className="m-1">
            {value}
            {valuePostfix}
          </span>
        )}
        {!hideValue && !hideMaxValue && <span className="m-1">{'/'}</span>}
        {!hideMaxValue && (
          <span className="m-1">
            {maxValue}
            {maxValuePostfix}
          </span>
        )}
      </div>
      <span className="invisible">.</span>
    </div>
  );
};
