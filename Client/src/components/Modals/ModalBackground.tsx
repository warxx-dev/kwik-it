import { createPortal } from "react-dom";

interface ModalBackgroundProps {
  onClick: () => void;
}

export const ModalBackground = ({ onClick }: ModalBackgroundProps) => {
  return createPortal(
    <div
      onClick={onClick}
      className="w-dvw h-dvh backdrop-blur-sm fixed top-0 left-0 bg-black/20 z-20"
    ></div>,
    document.body,
  );
};
