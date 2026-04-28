import type { Dispatch, SetStateAction } from "react";
import type { FieldValues, UseFormRegister } from "react-hook-form";

export interface scissorsSvgProps {
  width: number;
  height: number;
}

export type Link = {
  originalUrl: string;
  code: string;
  clicks: number;
  createdAt: Date;
  id: number;
};

export interface inputProps {
  placeholder: string;
  text: string;
  name: string;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
  className?: string;
  defaultValue?: string;
  errors?: string;
  register: UseFormRegister<FieldValues>;
}

type ButtonClickHandler =
  | (() => void)
  | ((e: React.MouseEvent<HTMLButtonElement>) => void)
  | ((e: React.FormEvent<HTMLFormElement>) => void);

export interface buttonProps {
  onClick?: ButtonClickHandler;
  text?: string;
  icon?: React.ReactNode;
  border?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  gradient?: boolean;
  hiddenText?: boolean;
  onMouseMove?: () => void;
  disabled?: boolean;
}

export interface TableCardProps {
  originalUrl: string;
  shortCode: string;
  code: string;
  clicks: number;
  date: string;
  id: number;
}

export interface EditModalProps {
  shortCode: string;
  originalUrl: string;
  setEditModal: Dispatch<SetStateAction<boolean>>;
  id: number;
}
