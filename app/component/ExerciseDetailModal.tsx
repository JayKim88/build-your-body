import { useEffect, useState } from "react";
import { Exercise } from "../api/types";
import Image from "next/image";

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
      const timer = setTimeout(() => setVisible(isOpen), 1000);
      return () => clearTimeout(timer);
    } else {
      const openTimer = setTimeout(() => setOpen(isOpen), 1000);
      const timer = setTimeout(() => setVisible(isOpen), 500);
      return () => {
        clearTimeout(openTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const handleCartButtonClick = (v: string) => {};

  const { gif_url, guide, summary, name, ref } = data ?? {};

  return (
    <div
      className={`${
        open
          ? "flex fixed inset-0 items-center justify-end bg-black bg-opacity-50 z-20 pr-4"
          : "hidden"
      }`}
    >
      <div
        className={`transition-all duration-500 ${
          visible ? "translate-x-0" : `translate-x-full`
        }
           w-[800px] h-[1020px] rounded-3xl p-5 bg-gray1`}
      >
        <header className="flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center justify-center"
          >
            <Image
              src="/close-button.png"
              width={48}
              height={48}
              alt="close button"
            />
          </button>
        </header>
        <main>{summary}</main>
        <footer className="flex justify-end gap-10">
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
