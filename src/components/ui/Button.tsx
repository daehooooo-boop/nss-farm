import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
export type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,transform,opacity,border-color] duration-200 ease-[var(--ease-out-soft)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-night-soft",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink",
  inverse: "bg-paper text-ink hover:bg-surface",
};

const SIZE: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base md:h-[52px]",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "lg",
  extra = "",
) {
  const sizing = variant === "ghost" ? "h-11 px-1 text-[15px]" : SIZE[size];
  return `${BASE} ${VARIANT[variant]} ${sizing} ${extra}`;
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
};

export function Button({
  variant,
  size,
  icon,
  children,
  className = "",
  type = "button",
  ...rest
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {icon}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  children,
  className = "",
  ...rest
}: CommonProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {icon}
    </Link>
  );
}
