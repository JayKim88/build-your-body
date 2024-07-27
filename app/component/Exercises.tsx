"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Exercise } from "../api/types";
import { exerciseTypes, ExerciseType } from "./Filter";
import { ExerciseDetailModal, OVERLAY_OPEN_DELAY } from "./ExerciseDetailModal";
import { AddToCart } from "../icon/AddToCart";
import { RemoveFromCart } from "../icon/RemoveFromCart";
import { useCartStore } from "../store";

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
        isAleadyInCart && "text-gray6"
      }  text-gray1 hover:text-gray6 transition-all ease-in-out duration-300`}
    />
  </button>
);

const ExerciseCard = (
  props: Exercise & {
    onClick: (v: string) => void;
  }
) => {
  const cartItems = useCartStore((state) => state.stored);
  const addToCart = useCartStore((state) => state.add);
  const removeFromCart = useCartStore((state) => state.remove);

  const { _id, type, thumbnail_img_url, name, summary, onClick, ...rest } =
    props;

  const bgColor = exerciseTypes.find(
    (v) => v.type.toLowerCase() === type.toLowerCase()
  )?.selectedColor;

  const isAleadyInCart = !!cartItems.find((v) => v === _id);

  return (
    <div
      key={_id}
      className={`${bgColor} w-[384px] h-[590px] rounded-3xl p-5 gap-y-6 flex flex-col cursor-pointer`}
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
      <div className="text-[32px]">{name}</div>
      <div className="text-lg min-h-[84px] text-black">{summary}</div>
      <div className="flex w-full justify-evenly">
        <CartIcon
          title="add to cart"
          onClick={() => addToCart(_id)}
          Icon={AddToCart}
          isAleadyInCart={isAleadyInCart}
        />
        <CartIcon
          title="remove from cart"
          onClick={() => removeFromCart(_id)}
          Icon={RemoveFromCart}
        />
      </div>
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
      selectedType === "All"
        ? data
        : data.filter(
            (v) => v.type.toLowerCase() === selectedType.toLocaleLowerCase()
          );

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
