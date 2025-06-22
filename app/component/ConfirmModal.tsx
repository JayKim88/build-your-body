import Image from "next/image";
import { useEffect, useState } from "react";
import { MODAL_VISIBLE_DELAY } from "./ModalWrapper";
import { Button } from "./Button";
import { useIsMobile } from "../hook/useWindowSize";

export type ConfirmModalProps = {
  isOpen: boolean;
  onClick: (v: boolean) => void;
  content?: string;
  loading?: boolean;
};

export const ConfirmModal = ({
  isOpen,
  onClick,
  content = "Are you sure?",
  loading,
}: ConfirmModalProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div
      data-testid="confirm-modal"
      className={`${
        open
          ? "flex fixed inset-0 items-center justify-center z-20 pr-4"
          : "hidden"
      } bg-black bg-opacity-50 delay-${MODAL_VISIBLE_DELAY + 500}`}
    >
      <div
        className={`w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-3xl p-5 bg-gray6 flex flex-col items-center justify-center gap-4`}
      >
        <div className="relative w-[172px] h-[172px]">
          <Image
            src="/confirm.webp"
            alt="Confirmation dialog icon"
            fill
            sizes="172px"
            style={{ objectFit: "contain" }}
            loading="lazy"
          />
        </div>
        <div
          className="text-2xl sm:text-4xl text-black whitespace-pre-wrap 
        text-center leading-[48px]"
        >
          {content}
        </div>
        <div className="flex gap-x-4 mt-4">
          <Button
            title="Nope"
            onClick={() => onClick(false)}
            className={
              "w-fit sm:w-[144px] h-[60px] hover:bg-red hover:text-gray6 bg-red"
            }
            fontSize={isMobile ? 20 : 40}
          />
          <Button
            title="Yeah"
            onClick={() => {
              if (loading) return;
              onClick(true);
            }}
            className={
              "w-fit sm:w-[144px] h-[60px] hover:bg-lightGreen hover:text-gray6 bg-lightGreen"
            }
            fontSize={isMobile ? 20 : 40}
          />
        </div>
      </div>
    </div>
  );
};
