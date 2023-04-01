import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import styles from './NewEventDialog.module.css';

type Props = {
  open: boolean;
  onClose: (status: 'save' | 'discard') => void;
};

const NewEventDialog = ({ open, onClose }: Props) => (
  <Dialog.Root open={open}>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay} />
      <Dialog.Content className={styles.DialogContent}>
        <Dialog.Title className={styles.DialogTitle}>Edit profile</Dialog.Title>
        <Dialog.Description className={styles.DialogDescription}>
          Make changes to your profile here. Click save when you're done.
        </Dialog.Description>

        <Dialog.Close asChild>
          <button onClick={() => onClose('save')}>Save changes</button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <button onClick={() => onClose('discard')} aria-label="Close">
            cklose{' '}
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default NewEventDialog;
