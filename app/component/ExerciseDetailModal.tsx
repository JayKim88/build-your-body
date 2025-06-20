"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { Exercise } from "../api/types";
import { useCartStore } from "../store";
import { ModalWrapper, OVERLAY_OPEN_DELAY } from "./ModalWrapper";
import { CartTitleButton } from "./CartTitleButton";
import { useBodySnackbar } from "../hook/useSnackbar";
import { getExerciseData } from "../api/exercise/getData";
import { capitalizeFirstLetter } from "../utils";

export type ExerciseDetailModalProps = {
  isOpen: boolean;
  data?: Exercise;
  onClose: () => void;
  exerciseId?: string;
};

export const ExerciseDetailModal = ({
  isOpen,
  data,
  onClose,
  exerciseId,
}: ExerciseDetailModalProps) => {
  const [exerciseData, setExerciseData] = useState<Exercise>();
  const { bodySnackbar } = useBodySnackbar();
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.stored);
  const addToCart = useCartStore((state) => state.add);
  const removeFromCart = useCartStore((state) => state.remove);

  const isLoggedIn = !!session;

  const handleGetData = useCallback(async () => {
    const fetchedData = exerciseId && (await getExerciseData(exerciseId));

    fetchedData && setExerciseData(fetchedData);
  }, [exerciseId]);

  useEffect(() => {
    if (!exerciseId) return;
    handleGetData();
  }, [exerciseId, handleGetData]);

  const {
    _id,
    video_url,
    guide,
    name,
    ref,
    description,
    thumbnail_img_url,
    type,
  } = data ?? exerciseData ?? {};

  const isAleadyInCart = !!cartItems.find((v) => v.id === _id);

  const handleCartButtonClick = (v: string) => {
    const isAdd = v === "Add";

    if (isAdd) {
      if (cartItems.length > 4) {
        bodySnackbar("운동은 5개까지 추가할 수 있어요. 무리하지 마세요😓", {
          variant: "info",
        });

        return;
      }

      const enabledToAdd =
        !isAleadyInCart && _id && name && thumbnail_img_url && type;

      if (enabledToAdd) {
        addToCart({
          id: _id,
          name: name,
          img_url: thumbnail_img_url,
          type: type,
        });

        bodySnackbar("운동이 장바구니에 추가되었어요.", {
          variant: "success",
        });
      }

      return;
    }

    if (isAleadyInCart && _id) {
      removeFromCart(_id);
      bodySnackbar("운동이 장바구니에서 제거되었어요.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (isOpen || !exerciseData) return;
    setTimeout(() => setExerciseData(undefined), OVERLAY_OPEN_DELAY);
  }, [isOpen, exerciseData]);

  const isDataReady = data ?? exerciseData;

  return (
    <ModalWrapper isOpen={isOpen && !!isDataReady} onClose={onClose}>
      <main className="flex flex-col gap-y-5">
        <iframe
          title="Exercise video player"
          src={video_url}
          width="760"
          height="430"
        />
        <section className="flex flex-col gap-y-6">
          <div className="text-3xl">{capitalizeFirstLetter(name ?? "")}</div>
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
      {isLoggedIn && !exerciseData && (
        <footer className="flex justify-end gap-10 mt-auto">
          <CartTitleButton
            title="Add"
            onClick={() => handleCartButtonClick("Add")}
            isAleadyInCart={isAleadyInCart}
          />
          <CartTitleButton
            title="Delete"
            onClick={() => handleCartButtonClick("Delete")}
            className={`${
              isAleadyInCart
                ? ""
                : "hover:bg-red hover:text-gray6 cursor-auto pointer-events-none"
            }`}
          />
        </footer>
      )}
    </ModalWrapper>
  );
};
