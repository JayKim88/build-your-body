type ButtonProps = {
  title: string;
  onClick: () => void;
  isAleadyInCart?: boolean;
  className?: string;
  useIcon?: boolean;
  fontSize?: number;
  disabled?: boolean;
};

export const Button = ({
  title,
  onClick,
  className,
  fontSize = 20,
  disabled,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${
        !disabled && "hover:text-black hover:bg-gray6"
      } flex items-center justify-center gap-1 py-2 px-4 rounded-3xl width-[110px] transition-all duration-300 ease-in-out
         ${className}
        `}
      disabled={disabled}
    >
      <span
        style={{
          fontSize,
        }}
      >
        {title}
      </span>
    </button>
  );
};
