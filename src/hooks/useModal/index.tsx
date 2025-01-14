import { useState } from "react";
import { IModalProps, Modal } from "./Modal";

function useModal() {
    const [isOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true)
    }
    
    function closeModal() {
        setIsOpen(false)
    }

    const ModalComponent = ({children, modalButtons, modalTitle, customSizes}: IModalProps) => {
        return (
            <Modal isOpen={isOpen} modalButtons={modalButtons} modalTitle={modalTitle} customSizes={customSizes}>
                {children}
            </Modal>
        )
    }

    return { openModal, closeModal, ModalComponent }
}

export { useModal }