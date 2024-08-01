import Image from "next/image";

type CartButtonProps = {
  title: string;
  onClick: () => void;
  isAleadyInCart?: boolean;
  className?: string;
  fontSize?: number;
};

export const CartTitleButton = ({
  title,
  onClick,
  isAleadyInCart,
  className,
  fontSize,
}: CartButtonProps) => {
  const isAdd = title === "Add";

  return (
    <button
      onClick={onClick}
      className={`${
        isAdd ? (isAleadyInCart ? "bg-gray6" : "bg-lightGreen") : "bg-red"
      } hover:text-black hover:bg-gray6 flex items-center justify-center gap-1 py-2 px-4 rounded-3xl width-[110px] transition-all duration-300 ease-in-out
        ${isAleadyInCart && "text-black pointer-events-none"} ${className}
        `}
    >
      <Image src="/cart-icon/cart.svg" width={32} height={32} alt="cart" />
      <span className={`text-[${fontSize ?? 20}px]`}>{title}</span>
    </button>
  );
};
