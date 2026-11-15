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
  a: { badge: "bg-person-a text-paper", text: "text-person-a", ring: "focus:border-person-a focus:ring-person-a" },
  b: { badge: "border border-person-b text-person-b", text: "text-person-b", ring: "focus:border-person-b focus:ring-person-b" },
} as const;

/** 이름 입력: 입력창 안쪽 왼쪽에 A/B 배지와 "이름" 라벨을 둔 큰 입력창 (상하 배치용) */
export function NameField({ personKey, label, value, placeholder, error, onChange, onBlur }: NameFieldProps) {
  const id = useId();
  const tone = TONE[personKey];
  return (
    <div>
      <div className="relative">
        <label
          htmlFor={id}
          className="pointer-events-none absolute inset-y-0 left-4 flex items-center gap-2 text-[14px] font-semibold md:left-5 md:text-[15px]"
        >
          <span
            aria-hidden="true"
            className={`grid size-6 place-items-center rounded-full font-display text-[13px] font-bold ${tone.badge}`}
          >
            {personKey.toUpperCase()}
          </span>
          <span className={tone.text}>이름</span>
          <span className="sr-only">({label})</span>
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
          className={`block h-14 w-full min-w-0 rounded-[var(--radius-field)] border-[1.5px] bg-surface pr-4 pl-[84px] text-[20px] font-bold tracking-[0.02em] text-ink placeholder:text-[17px] placeholder:font-normal placeholder:text-ink-faint/70 transition-[border-color,box-shadow] duration-200 outline-none focus:ring-2 md:h-16 md:pl-[92px] md:text-[22px] ${
            error ? "border-danger" : "border-line-strong"
          } ${tone.ring}`}
        />
      </div>
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
