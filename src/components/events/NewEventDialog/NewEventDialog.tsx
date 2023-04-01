import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import styles from './NewEventDialog.module.css';

type Props = {
  open: boolean;
  onClose: (status: 'save' | 'discard') => void;
  children: React.ReactNode;
  formIsValid: boolean;
};

const NewEventDialog = ({ open, children, onClose, formIsValid }: Props) => (
  <Dialog.Root open={open}>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay} />
      <Dialog.Content className={styles.DialogContent}>
        <Dialog.Title className={styles.DialogTitle}>New Event</Dialog.Title>
        <Dialog.Description className={styles.DialogDescription}>
          Share your upcoming performance with art lovers in your community!
        </Dialog.Description>

        {children}

        <div className="m-auto flex justify-center">
          <Dialog.Close asChild>
            <button
              disabled={!formIsValid}
              className={`leading-sm inline-flex items-center rounded-full bg-green-600  p-3 text-sm text-white  no-underline transition hover:bg-green-500 disabled:opacity-50`}
              onClick={() => onClose('save')}>
              Create
            </button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <button
              className={`leading-sm inline-flex items-center rounded-full  bg-red-600 p-3 text-sm  text-white no-underline transition hover:bg-red-500`}
              onClick={() => onClose('discard')}
              aria-label="Close">
              Discard
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default NewEventDialog;
