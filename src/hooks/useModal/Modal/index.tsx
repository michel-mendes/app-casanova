import { ReactNode, useEffect } from "react";

// Components
import { CustomButton } from "../../../app/components/CustomButton";

import closeCircledButton from "../../../app/images/close-circle-svgrepo-com.svg"

import styles from "./styles.module.css"
import Image from "next/image";

export interface IModalProps {
  children?: ReactNode;
  modalTitle: string;
  isOpen?: boolean;
  customSizes?: {
    width: string;
    height: string;
  }

  modalButtons: {
    okButton?: {
      customCaption?: string,
      onClick: () => void;
    },
    cancelButton?: {
      customCaption?: string,
      enabled?: boolean,
      onClick: () => void;
    },
    saveButton?: {
      customCaption?: string,
      enabled?: boolean;
      onClick: () => void;
    },
    yesButton?: {
      customCaption?: string,
      onClick: () => void;
    },
    noButton?: {
      customCaption?: string,
      onClick: () => void;
    },
    deleteButton?: {
      customCaption?: string,
      enabled?: boolean;
      onClick: () => void;
    }
  }
}

function Modal({ isOpen, modalTitle, children, modalButtons, customSizes }: IModalProps) {

  const btnOk = !modalButtons.okButton ? null : <CustomButton caption={`${modalButtons.okButton?.customCaption ? modalButtons.okButton.customCaption : "OK"}`} handleClick={modalButtons.okButton.onClick} captionAlignment="center" />
  const btnCancel = !modalButtons.cancelButton ? null : <CustomButton handleClick={modalButtons.cancelButton.onClick} disabled={ (modalButtons.cancelButton.enabled !== undefined) ? !modalButtons.cancelButton.enabled : false } caption={`${modalButtons.cancelButton?.customCaption ? modalButtons.cancelButton.customCaption : "Cancelar"}`} captionAlignment="center" />
  const btnSave = !modalButtons.saveButton ? null : <CustomButton handleClick={modalButtons.saveButton.onClick} disabled={ (modalButtons.saveButton.enabled !== undefined) ? !modalButtons.saveButton.enabled : false } caption={`${modalButtons.saveButton?.customCaption ? modalButtons.saveButton.customCaption : "Salvar"}`} captionAlignment="center" />
  const btnYes = !modalButtons.yesButton ? null : <CustomButton handleClick={modalButtons.yesButton.onClick} caption={`${modalButtons.yesButton?.customCaption ? modalButtons.yesButton.customCaption : "Sim"}`} captionAlignment="center" />
  const btnNo = !modalButtons.noButton ? null : <CustomButton handleClick={modalButtons.noButton.onClick} caption={`${modalButtons.noButton?.customCaption ? modalButtons.noButton.customCaption : "Não"}`} captionAlignment="center" />
  const btnDelete = !modalButtons.deleteButton ? null : <CustomButton handleClick={modalButtons.deleteButton.onClick} disabled={!modalButtons.deleteButton.enabled} caption={`${modalButtons.deleteButton?.customCaption ? modalButtons.deleteButton.customCaption : "Excluir"}`} captionAlignment="center" />

  // Handle ESC key pressing
  const cancelModal = (modalButtons.cancelButton?.onClick || modalButtons.noButton?.onClick) || function () { }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelModal()
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Remove the event when the modal is killed
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cancelModal]);
  // ------------------------------------------------------

  if (!isOpen) return null

  return (
    <>
      <div className={styles.modal_overlay}>
        <div className={styles.modal_box} style={(customSizes) && {width: customSizes.width, height: customSizes.height}} onClick={(e) => { e.stopPropagation() }}>

          {/* Modal header */}
          <div className={styles.modal_header}>
            <span>
              {modalTitle}
            </span>

            <Image
              src={closeCircledButton}
              alt="Fechar janela"
              width={32}
              height={32}
              className={styles.close_button}
              onClick={() => {cancelModal()}}
            />
          </div>

          {/* Modal body */}
          <div className={styles.modal_body}>
            {children}
          </div>

          {/* Modal footer */}
          <div className={styles.modal_footer}>
            {btnDelete}
            {btnCancel}
            {btnNo}
            {btnYes}
            {btnOk}
            {btnSave}
          </div>

        </div>
      </div>
    </>
  )
}

export { Modal }