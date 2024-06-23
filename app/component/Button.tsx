import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: string;
  customStyles?: string;
};

const Button = ({ children, customStyles }: ButtonProps) => {
  return (
    <button className={clsx("btn-basic", customStyles)}>{children}</button>
  );
};

export { Button };
