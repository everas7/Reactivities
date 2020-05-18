import React, { useContext } from 'react';
import { Modal } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';

function ModalContainer() {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body },
    closeModal
  } = rootStore.modalStore;
  return (
    <Modal open={open} size="mini" onClose={closeModal}>
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
}

export default observer(ModalContainer);
