"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  Title?: ReactNode;
  children: ReactNode;
  customClassName?: string;
};

export const ModalWrapper = ({
  isOpen,
  onClose,
  Title,
  children,
  customClassName,
}: ModalWrapperProps) => {
  const modalWrapperRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
      const timer = setTimeout(() => setVisible(true), MODAL_VISIBLE_DELAY);
      return () => clearTimeout(timer);
    } else {
      const openTimer = setTimeout(() => {
        setOpen(false);
        if (!childrenRef.current) return;
        childrenRef.current.scrollTop = 0;
      }, OVERLAY_OPEN_DELAY);
      const timer = setTimeout(() => setVisible(false), MODAL_VISIBLE_DELAY);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  return (
    <div
      ref={modalWrapperRef}
      data-testid="modal-overlay"
      role="dialog"
      className={`${
        open
          ? "flex fixed inset-0 items-center justify-end z-20 px-4"
          : "hidden"
      } ${visible && "bg-black bg-opacity-50"} delay-${
        MODAL_VISIBLE_DELAY + 500
      }`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return; // ignore clicking cart icons
        onClose();
      }}
    >
      <div
        className={`transition-all duration-500 ${
          visible ? "translate-x-0" : `translate-x-full -mr-96`
        }
           w-[800px] max-h-[94vh] rounded-3xl p-5 bg-gray1 flex flex-col ${
             customClassName ?? ""
           }`}
      >
        <header
          className={`flex pb-5 ${Title ? "justify-between" : "justify-end"}`}
        >
          {Title}
          <button
            onClick={onClose}
            className="flex items-center justify-center"
          >
            <div className="relative w-[48px] h-[48px]">
              <Image
                src="/close-button.png"
                alt="close button"
                fill
                style={{ objectFit: "contain" }}
                sizes="48px"
              />
            </div>
          </button>
        </header>
        <div
          ref={childrenRef}
          className="overflow-x-hidden overflow-y-auto overscroll-none"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const MODAL_VISIBLE_DELAY = 200;
export const OVERLAY_OPEN_DELAY = 400;
