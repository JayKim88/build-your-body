"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Exercise } from "../api/types";

type ExerciseDetailModalProps = {
  isOpen: boolean;
  data?: Exercise;
  onClose: () => void;
};

type CartButtonProps = {
  title: string;
  onClick: (v: string) => void;
};

const CartButton = ({ title }: CartButtonProps) => {
  const isAdd = title === "Add";

  return (
    <button
      // onClick={onClose}
      className={`${
        isAdd ? "bg-lightGreen" : "bg-red"
      } flex items-center justify-center gap-1 py-2 px-4 rounded-3xl width-[110px]`}
    >
      <Image src="/cart-icon/cart.svg" width={32} height={32} alt="cart" />
      <span className="text-[20px]">{title}</span>
    </button>
  );
};

export const ExerciseDetailModal = ({
  isOpen,
  data,
  onClose,
}: ExerciseDetailModalProps) => {
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

  const handleCartButtonClick = (v: string) => {};

  const { video_url, guide, summary, name, ref, description } = data ?? {};

  return (
    <div
      className={`${
        open
          ? "flex fixed inset-0 items-center justify-end z-20 pr-4"
          : "hidden"
      } ${visible && "bg-black bg-opacity-50"} delay-${
        MODAL_VISIBLE_DELAY + 300
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
        <main className="flex flex-col gap-y-5">
          <iframe
            title="Exercise video player"
            src={video_url}
            width="760"
            height="430"
          />
          <section className="flex flex-col gap-y-6">
            <div className="text-3xl">{name}</div>
            <div>{description}</div>
            <div className="flex gap-x-2 justify-start">
              <div className="min-w-[160px] text-2xl font-medium">
                운동 방법
              </div>
              <ol className="list-decimal list-inside gap-1">
                {guide?.map((v, index) => (
                  <li key={index} className="mb-2">
                    {v}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex gap-x-2 justify-start">
              <div className="min-w-[160px] text-2xl font-medium">
                참고 링크
              </div>
              <ul className="list-disc list-inside">
                {ref?.map((v, index) => (
                  <li key={index}>
                    <Link
                      href={v.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="hover:text-yellow"
                    >
                      {v.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
        <footer className="flex justify-end gap-10 mt-auto">
          <CartButton
            title="Add"
            onClick={() => handleCartButtonClick("Add")}
          />
          <CartButton
            title="Delete"
            onClick={() => handleCartButtonClick("Delete")}
          />
        </footer>
      </div>
    </div>
  );
};

export const MODAL_VISIBLE_DELAY = 200;
export const OVERLAY_OPEN_DELAY = 400;
