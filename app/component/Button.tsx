import React from "react";
import { SpinLoader } from "./SpinLoader";

type ButtonProps = {
  title: string;
  onClick: () => void;
  isAleadyInCart?: boolean;
  className?: string;
  useIcon?: boolean;
  fontSize?: number;
  disabled?: boolean;
  letterSpacing?: number;
  loading?: boolean;
};

export const Button = ({
  title,
  onClick,
  className,
  fontSize = 20,
  letterSpacing = 2,
  disabled,
  loading,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${
        !disabled && "hover:text-black hover:bg-gray6"
      } flex items-center justify-center gap-1 py-2 px-4 rounded-3xl 
      width-[110px] transition-all duration-300 ease-in-out relative
         ${className}
        `}
      disabled={disabled || loading}
    >
      {loading && <SpinLoader />}
      <span
        style={{
          fontSize,
          letterSpacing,
        }}
      >
        {title}
      </span>
    </button>
  );
};
