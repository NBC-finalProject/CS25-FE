import React from "react";
import { useModalContext } from "../../contexts/ModalContext";
import Modal from "./Modal";

const ModalManager: React.FC = () => {
  const { modals, closeModal } = useModalContext();

  if (modals.length === 0) {
    return null;
  }

  return (
    <>
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          isOpen={true}
          onClose={() => closeModal(modal.id)}
          title={modal.title}
          size={modal.size}
          closable={modal.closable}
        >
          {modal.content}
        </Modal>
      ))}
    </>
  );
};

export default ModalManager;
