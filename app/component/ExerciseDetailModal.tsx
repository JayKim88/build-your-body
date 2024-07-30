"use client";

import Image from "next/image";
import Link from "next/link";

import { Exercise } from "../api/types";
import { useCartStore } from "../store";
import { ModalWrapper } from "./ModalWrapper";
import { CartTitleButton } from "./CartTitleButton";

type ExerciseDetailModalProps = {
  isOpen: boolean;
  data?: Exercise;
  onClose: () => void;
};

export const ExerciseDetailModal = ({
  isOpen,
  data,
  onClose,
}: ExerciseDetailModalProps) => {
  const cartItems = useCartStore((state) => state.stored);
  const addToCart = useCartStore((state) => state.add);
  const removeFromCart = useCartStore((state) => state.remove);

  const {
    _id,
    video_url,
    guide,
    name,
    ref,
    description,
    thumbnail_img_url,
    type,
  } = data ?? {};

  const isAleadyInCart = !!cartItems.find((v) => v.id === _id);

  const handleCartButtonClick = (v: string) => {
    const isAdd = v === "Add";

    if (isAdd) {
      const enabledToAdd =
        !isAleadyInCart && _id && name && thumbnail_img_url && type;

      enabledToAdd &&
        addToCart({
          id: _id,
          name: name,
          img_url: thumbnail_img_url,
          type: type,
        });

      return;
    }

    _id && removeFromCart(_id);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
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
        <CartTitleButton
          title="Add"
          onClick={() => handleCartButtonClick("Add")}
          isAleadyInCart={isAleadyInCart}
        />
        <CartTitleButton
          title="Delete"
          onClick={() => handleCartButtonClick("Delete")}
        />
      </footer>
    </ModalWrapper>
  );
};
