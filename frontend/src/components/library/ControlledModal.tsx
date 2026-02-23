import React, { PropsWithChildren, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import clsx from 'clsx';

import { Icon } from './Icon';

type ControlledModalProps = PropsWithChildren<
  Omit<React.ComponentProps<typeof Dialog>, 'open' | 'onClose'> & {
    contentClassName?: string;
    isShown: boolean;
    close: () => void;
  }
>;

export const ControlledModal: React.FC<ControlledModalProps> = ({
  isShown,
  close,
  contentClassName,
  children,
  ...props
}) => {
  useEffect(() => {
    if (isShown) {
      document.body.classList.add('overflow-y-hidden');
      return;
    }

    document.body.classList.remove('overflow-y-hidden');
  }, [isShown]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-y-hidden');
    };
  }, []);

  return (
    <Dialog open={isShown} onClose={close} {...props}>
      <DialogBackdrop className="fixed inset-0 z-40 bg-o-white/25 backdrop-blur-sm" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
        <DialogPanel
          className={clsx('overflow-y-auto rounded-lg', contentClassName)}
        >
          {children}
        </DialogPanel>
      </div>

      <button
        type="button"
        className={clsx(
          'bg-o-white-max p-1 md:p-2',
          'fixed top-1 right-1 md:top-2 md:right-2 z-50',
          'rounded-sm text-sm md:text-md lg:text-lg'
        )}
        onClick={close}
      >
        <Icon icon="close" />
      </button>
    </Dialog>
  );
};
