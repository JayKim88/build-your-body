"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Exercise } from "../api/types";
import { useCartStore } from "../store";

type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  Title?: ReactNode;
  children: ReactNode;
};

export const ModalWrapper = ({
  isOpen,
  onClose,
  Title,
  children,
}: ModalWrapperProps) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
      const timer = setTimeout(() => setVisible(true), MODAL_VISIBLE_DELAY);
      return () => clearTimeout(timer);
    } else {
      const openTimer = setTimeout(() => setOpen(false), OVERLAY_OPEN_DELAY);
      const timer = setTimeout(() => setVisible(false), MODAL_VISIBLE_DELAY);
      return () => {
        clearTimeout(openTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  return (
    <div
      className={`${
        open
          ? "flex fixed inset-0 items-center justify-end z-20 pr-4"
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
           w-[800px] h-[1020px] rounded-3xl p-5 bg-gray1 flex flex-col`}
      >
        <header className="flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center justify-center"
          >
            {Title}
            <div className="relative w-[48px] h-[48px]">
              <Image
                src="/close-button.png"
                alt="close button"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 1200px) 100vw"
              />
            </div>
          </button>
        </header>
        {children}
      </div>
    </div>
  );
};

export const MODAL_VISIBLE_DELAY = 200;
export const OVERLAY_OPEN_DELAY = 400;
