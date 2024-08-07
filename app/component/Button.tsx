import Image from "next/image";

type ButtonProps = {
  title: string;
  onClick: () => void;
  isAleadyInCart?: boolean;
  className?: string;
  useIcon?: boolean;
  fontSize?: number;
  bgColor: string;
  disabled?: boolean;
};

export const Button = ({
  title,
  onClick,
  className,
  fontSize,
  bgColor,
  disabled,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-${bgColor} ${
        !disabled && "hover:text-black hover:bg-gray6"
      } flex items-center justify-center gap-1 py-2 px-4 rounded-3xl width-[110px] transition-all duration-300 ease-in-out
         ${className}
        `}
      disabled={disabled}
    >
      <span className={`text-[${fontSize ?? 20}px]`}>{title}</span>
    </button>
  );
};
