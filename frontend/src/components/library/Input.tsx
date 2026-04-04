import React, { HTMLAttributes, HTMLInputTypeAttribute } from 'react';
import clsx from 'clsx';

export type CustomInputProps = HTMLAttributes<HTMLInputElement> & {
  type?: HTMLInputTypeAttribute;
  bottomBorder?: boolean;
  placeholder?: string;
};

export const Input: React.FC<CustomInputProps> = ({
  className,
  bottomBorder,
  ...props
}) => {
  return (
    <input
      className={clsx(
        'p-1 md:p-2 w-full',
        'text-o-black font-medium ',
        'bg-transparent',
        'transition-all duration-200',
        'focus:outline-hidden',
        bottomBorder && 'border-b border-o-black focus:border-b-2',
        className
      )}
      {...props}
    />
  );
};
