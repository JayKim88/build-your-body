"use client";
import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: string;
  customStyles?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  children,
  customStyles,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      disabled={!!disabled}
      className={clsx("btn-basic", customStyles)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
