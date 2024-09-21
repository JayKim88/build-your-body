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

const CartIcon = ({ title, onClick, Icon, isAleadyInCart }: CartIconProps) => (
  <button
    aria-label={title}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="flex items-center justify-center"
  >
    <Icon
      className={`${
        isAleadyInCart ? "fill-gray6 cursor-default" : "fill-gray1"
      } hover:fill-gray6 transition-all ease-in-out duration-300`}
    />
  </button>
);

const ExerciseCard = (
  props: Exercise & {
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

    addToCart({
      id: _id,
      name: name,
      img_url: thumbnail_img_url,
      type: type,
    });
  };

  return (
    <div
      key={_id}
      className={`${bgColor} w-[384px] h-fit rounded-3xl p-5 gap-y-6 flex flex-col cursor-pointer`}
      onClick={() => onClick(_id)}
    >
      <div className="relative w-full h-72 rounded-2xl overflow-hidden">
        <Image
          src={thumbnail_img_url}
          alt="name"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 100vw"
          priority
        />
      </div>
      <div className="text-[32px]">{capitalizeFirstLetter(name)}</div>
      <div className="text-lg min-h-[84px] text-black">{summary}</div>
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
            onClick={() => removeFromCart(_id)}
            Icon={RemoveFromCart}
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
      <section className="flex gap-6 flex-wrap">
        {exercisesData.length ? (
          exercisesData.map((data) => (
            <ExerciseCard
              key={data._id}
              {...data}
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