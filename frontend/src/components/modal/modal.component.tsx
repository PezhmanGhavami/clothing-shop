import { ReactNode } from "react";

interface IModalProps {
  children: ReactNode;
}

const Modal = ({ children }: IModalProps) => {
  return <div className="modal">{children}</div>;
};

export default Modal;
