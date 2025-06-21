"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { Exercise } from "../api/types";
import AddToCart from "@/public/cart-icon/add-to-cart.svg";
import RemoveFromCart from "@/public/cart-icon/remove-from-cart.svg";
import { useCartStore } from "../store";
import { capitalizeFirstLetter, getBgColor } from "../utils";
import { useBodySnackbar } from "../hook/useSnackbar";
import { ExerciseType } from "../component/Filter";
import { OVERLAY_OPEN_DELAY } from "../component/ModalWrapper";
import { ExerciseDetailModal } from "../component/ExerciseDetailModal";

type ExercisesProps = {
  data?: Exercise[];
  selectedType: ExerciseType;
};

type CartIconProps = {
  title: string;
  onClick: () => void;
  Icon: ({ className }: { className: string }) => JSX.Element;
  isAleadyInCart?: boolean;
};

const CartIcon = ({ title, onClick, Icon, isAleadyInCart }: CartIconProps) => {
  const isAdd = title === "add to cart";

  const iconStyles = isAdd
    ? isAleadyInCart
      ? "fill-gray6"
      : "fill-gray1 hover:fill-gray6"
    : "fill-gray1 hover:fill-gray6 ";

  const btnStyles = isAdd
    ? isAleadyInCart
      ? "pointer-events-none"
      : ""
    : isAleadyInCart
    ? ""
    : "pointer-events-none";

  return (
    <button
      aria-label={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`${btnStyles} flex items-center justify-center`}
    >
      <Icon
        className={`${iconStyles} transition-all ease-in-out duration-400`}
      />
    </button>
  );
};

const ExerciseCard = (
  props: Omit<Exercise, "ref"> & {
    onClick: (v: string) => void;
  }
) => {
  const { bodySnackbar } = useBodySnackbar();
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.stored);
  const addToCart = useCartStore((state) => state.add);
  const removeFromCart = useCartStore((state) => state.remove);

  const { _id, type, thumbnail_img_url, name, summary, onClick, ...rest } =
    props;

  const bgColor = getBgColor(type);

  const isAleadyInCart = !!cartItems.find((v) => v.id === _id);

  const isLoggedIn = !!session;

  const handleAddToCart = () => {
    if (cartItems.length > 4) {
      bodySnackbar("운동은 5개까지 추가할 수 있어요. 무리하지 마세요😓", {
        variant: "info",
      });

      return;
    }

    bodySnackbar("운동이 장바구니에 추가되었어요.", {
      variant: "success",
    });

    addToCart({
      id: _id,
      name: name,
      img_url: thumbnail_img_url,
      type: type,
    });
  };

  const handleRemoveFromCart = () => {
    bodySnackbar("운동이 장바구니에서 제거되었어요.", {
      variant: "error",
    });

    removeFromCart(_id);
  };

  return (
    <div
      key={_id}
      className={`${bgColor} w-full sm:max-w-xs sm:w-[384px] h-fit rounded-3xl p-5 gap-y-6 flex flex-col cursor-pointer`}
      onClick={() => onClick(_id)}
    >
      <div className="relative w-full h-48 sm:h-60 md:h-72 rounded-2xl overflow-hidden">
        <Image
          src={thumbnail_img_url}
          alt="name"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 100vw"
          priority
        />
      </div>
      <div className="text-xl sm:text-2xl md:text-3xl">
        {capitalizeFirstLetter(name)}
      </div>
      <div className="text-base sm:text-lg min-h-[84px] text-black">
        {summary}
      </div>
      {isLoggedIn && (
        <div className="flex w-full justify-evenly">
          <CartIcon
            title="add to cart"
            onClick={handleAddToCart}
            Icon={AddToCart}
            isAleadyInCart={isAleadyInCart}
          />
          <CartIcon
            title="remove from cart"
            onClick={handleRemoveFromCart}
            Icon={RemoveFromCart}
            isAleadyInCart={isAleadyInCart}
          />
        </div>
      )}
    </div>
  );
};

const Exercises = ({ data, selectedType }: ExercisesProps) => {
  const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
  const [clickedExercise, setClickedExercise] = useState<Exercise>();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickExercise = (id: string) => {
    const data = exercisesData.find((v) => v._id === id);
    setClickedExercise(data);
    setIsOpen(true);
  };

  const handleClearClickedExercise = () => {
    setIsOpen(false);
    setTimeout(() => setClickedExercise(undefined), OVERLAY_OPEN_DELAY);
  };

  useEffect(() => {
    if (!data?.length) return;

    const filteredData =
      selectedType === "all"
        ? data
        : data.filter((v) => v.type === selectedType);

    setExercisesData(filteredData);
  }, [data, selectedType]);

  return (
    <>
      <section className="flex gap-6 flex-wrap mt-20 mb-[100px]">
        {exercisesData.length ? (
          exercisesData.map(({ ref, ...rest }) => (
            <ExerciseCard
              key={rest._id}
              {...rest}
              onClick={handleClickExercise}
            />
          ))
        ) : (
          <></>
        )}
      </section>
      <ExerciseDetailModal
        isOpen={isOpen}
        data={clickedExercise}
        onClose={handleClearClickedExercise}
      />
    </>
  );
};

export { Exercises };
