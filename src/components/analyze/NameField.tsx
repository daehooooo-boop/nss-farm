"use client";

import { useId } from "react";
import { NAME_MAX } from "@/lib/analysis/constants";
import type { PersonKey } from "@/lib/analysis/types";

type NameFieldProps = {
  personKey: PersonKey;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

const TONE = {
  a: { badge: "bg-person-a", text: "text-person-a", ring: "focus:border-person-a focus:ring-person-a" },
  b: { badge: "bg-person-b", text: "text-person-b", ring: "focus:border-person-b focus:ring-person-b" },
} as const;

/** 한 줄짜리 이름 입력: A/B 배지 + 라벨 + 큰 입력창 */
export function NameField({ personKey, label, value, placeholder, error, onChange, onBlur }: NameFieldProps) {
  const id = useId();
  const tone = TONE[personKey];
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-[13px] font-semibold">
        <span
          aria-hidden="true"
          className={`grid size-5 place-items-center rounded-full font-display text-[13px] text-paper ${tone.badge}`}
        >
          {personKey.toUpperCase()}
        </span>
        <span className={tone.text}>{label}</span>
        <span className="sr-only">이름</span>
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={NAME_MAX + 4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`mt-1.5 block h-12 w-full rounded-[var(--radius-field)] border bg-surface px-4 text-[18px] font-semibold tracking-[0.02em] text-ink placeholder:font-normal placeholder:text-ink-faint/70 transition-[border-color,box-shadow] duration-200 outline-none focus:ring-2 md:h-14 md:text-[20px] ${
          error ? "border-danger" : "border-line-strong"
        } ${tone.ring}`}
      />
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
