import React, { PropsWithChildren, useEffect } from 'react';

import { Dialog, DialogContent } from '@/components/library/shadcn-ui';
import clsx from 'clsx';

interface ControlledModalProps
  extends PropsWithChildren<React.HTMLAttributes<React.FC>> {
  contentClassName?: string;
  isShown: boolean;
  close: () => void;
}

export const ControlledModal: React.FC<ControlledModalProps> = (
  { isShown, close, contentClassName, children },
  ...props
) => {
  useEffect(() => {
    if (isShown) {
      document.body.classList.add('overflow-y-hidden');
    } else {
      document.body.classList.remove('overflow-y-hidden');
    }
  }, [isShown]);

  return (
    <Dialog
      open={isShown}
      onOpenChange={() => {
        close();
      }}
      {...props}
    >
      <DialogContent className={clsx('overflow-y-auto', contentClassName)}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
