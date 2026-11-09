"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type TextFieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  warning?: string;
  /** 포커스 링 색 */
  accent?: "a" | "b";
  size?: "lg" | "md";
  counter?: { value: number; max: number };
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

const RING = {
  a: "focus:border-person-a focus:ring-person-a",
  b: "focus:border-person-b focus:ring-person-b",
} as const;

export function TextField({
  label,
  hint,
  error,
  warning,
  accent = "a",
  size = "md",
  counter,
  className = "",
  ...input
}: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const msgId = `${id}-msg`;
  const describedBy = [hint ? hintId : null, error || warning ? msgId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14px] font-semibold text-ink">
          {label}
        </label>
        {counter ? (
          <span className={`text-[12px] tabular-nums ${counter.value > counter.max ? "text-danger" : "text-ink-faint"}`}>
            {counter.value}/{counter.max}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 block w-full rounded-[var(--radius-field)] border bg-surface px-4 text-ink placeholder:text-ink-faint/70 transition-[border-color,box-shadow] duration-200 outline-none focus:ring-2 focus:ring-offset-0 ${
          error ? "border-danger" : "border-line-strong"
        } ${RING[accent]} ${size === "lg" ? "h-14 text-[20px] font-semibold tracking-[0.02em]" : "h-12 text-[15px]"}`}
        {...input}
      />
      {hint ? (
        <p id={hintId} className="mt-2 text-[13px] leading-[1.5] text-ink-faint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={msgId} className="mt-2 text-[13px] leading-[1.5] text-danger" role="alert">
          {error}
        </p>
      ) : warning ? (
        <p id={msgId} className="mt-2 text-[13px] leading-[1.5] text-ink-soft">
          {warning}
        </p>
      ) : null}
    </div>
  );
}
