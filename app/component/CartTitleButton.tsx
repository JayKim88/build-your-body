import Image from "next/image";

type CartButtonProps = {
    title: string;
    onClick: () => void;
    isAleadyInCart?: boolean;
    className?: string;
  };

export const CartTitleButton = ({
  title,
  onClick,
  isAleadyInCart,
  className,
}: CartButtonProps) => {
  const isAdd = title === "Add";

  return (
    <button
      onClick={onClick}
      className={`${
        isAdd ? (isAleadyInCart ? "bg-gray6" : "bg-lightGreen") : "bg-red"
      } flex items-center justify-center gap-1 py-2 px-4 rounded-3xl width-[110px]
        ${isAleadyInCart && "text-black pointer-events-none"} ${className}
        `}
    >
      <Image src="/cart-icon/cart.svg" width={32} height={32} alt="cart" />
      <span className="text-[20px]">{title}</span>
    </button>
  );
};
