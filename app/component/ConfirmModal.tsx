import Image from "next/image";
import { useEffect, useState } from "react";
import { MODAL_VISIBLE_DELAY, OVERLAY_OPEN_DELAY } from "./ModalWrapper";
import { Button } from "./Button";

type ConfirmModalProps = {
  isOpen: boolean;
  onClick: (v: boolean) => void;
};

export const ConfirmModal = ({ isOpen, onClick }: ConfirmModalProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div
      className={`${
        open
          ? "flex fixed inset-0 items-center justify-center z-20 pr-4"
          : "hidden"
      } bg-black bg-opacity-50 delay-${MODAL_VISIBLE_DELAY + 500}`}
    >
      <div
        className={`w-[400px] h-[400px] rounded-3xl p-5 bg-gray6 flex flex-col items-center justify-center gap-4`}
      >
        <div className="relative w-[172px] h-[172px]">
          <Image
            src="/confirm.png"
            alt="confirm"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <div className="text-4xl text-black">Are you sure?</div>
        <div className="flex gap-x-4 mt-4">
          <Button
            title="Nope"
            onClick={() => onClick(false)}
            className={"w-[144px] h-[80px] hover:bg-red hover:text-gray6"}
            fontSize={40}
            bgColor="red"
          />
          <Button
            title="Yeah"
            onClick={() => onClick(true)}
            className={
              "w-[144px] h-[80px] hover:bg-lightGreen hover:text-gray6"
            }
            fontSize={40}
            bgColor="lightGreen"
          />
        </div>
      </div>
    </div>
  );
};
