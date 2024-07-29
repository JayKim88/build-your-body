"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Exercise } from "../api/types";
import { useCartStore } from "../store";
import { ModalWrapper } from "./ModalWrapper";

type ExerciseDetailModalProps = {
  isOpen: boolean;
  data?: Exercise;
  onClose: () => void;
};

type CartButtonProps = {
  title: string;
  onClick: () => void;
  isAleadyInCart?: boolean;
};

const CartButton = ({ title, onClick, isAleadyInCart }: CartButtonProps) => {
  const isAdd = title === "Add";

  return (
    <button
      onClick={onClick}
      className={`${
        isAdd ? "bg-lightGreen" : "bg-red"
      } flex items-center justify-center gap-1 py-2 px-4 rounded-3xl width-[110px]
      ${isAleadyInCart && "bg-gray6 text-black pointer-events-none"} 
      `}
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
  const cartItems = useCartStore((state) => state.stored);
  const addToCart = useCartStore((state) => state.add);
  const removeFromCart = useCartStore((state) => state.remove);

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

  const { _id, video_url, guide, name, ref, description } = data ?? {};

  const isAleadyInCart = !!cartItems.find((v) => v === _id);

  const handleCartButtonClick = (v: string) => {
    const isAdd = v === "Add";

    if (isAdd) {
      if (isAleadyInCart) return;

      _id && addToCart(_id);

      return;
    }

    _id && removeFromCart(_id);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      // title="Make your new program"
    >
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
            <div className="min-w-[160px] text-2xl font-medium">운동 방법</div>
            <ol className="list-decimal list-inside gap-1">
              {guide?.map((v, index) => (
                <li key={index} className="mb-2">
                  {v}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex gap-x-2 justify-start">
            <div className="min-w-[160px] text-2xl font-medium">참고 링크</div>
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
          isAleadyInCart={isAleadyInCart}
        />
        <CartButton
          title="Delete"
          onClick={() => handleCartButtonClick("Delete")}
        />
      </footer>
    </ModalWrapper>
  );
};

export const MODAL_VISIBLE_DELAY = 200;
export const OVERLAY_OPEN_DELAY = 400;
