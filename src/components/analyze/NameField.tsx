"use client";

import { useId } from "react";
import { NAME_MAX } from "@/lib/analysis/constants";
import type { PersonKey } from "@/lib/analysis/types";

type NameFieldProps = {
  personKey: PersonKey;
  label: string;
  value: string;
  placeholder: string;
  /** 입력창 안쪽 라벨 ("이름" / "Name") */
  nameLabel: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

const TONE = {
  a: { badge: "bg-person-a text-paper", text: "text-person-a", ring: "focus-within:border-person-a focus-within:ring-person-a" },
  b: { badge: "border border-person-b text-person-b", text: "text-person-b", ring: "focus-within:border-person-b focus-within:ring-person-b" },
} as const;

/** 이름 입력: 입력창 안쪽 왼쪽에 A/B 배지와 "이름" 라벨을 둔 큰 입력창 (상하 배치용) */
export function NameField({ personKey, label, value, placeholder, nameLabel, error, onChange, onBlur }: NameFieldProps) {
  const id = useId();
  const tone = TONE[personKey];
  return (
    <div>
      <div
        className={`flex h-14 items-center gap-3 rounded-[var(--radius-field)] border-[1.5px] bg-surface pr-4 pl-4 transition-[border-color,box-shadow] duration-200 focus-within:ring-2 md:h-16 md:pl-5 ${
          error ? "border-danger" : "border-line-strong"
        } ${tone.ring}`}
      >
        <label htmlFor={id} className="flex shrink-0 items-center gap-2 text-[14px] font-semibold md:text-[15px]">
          <span
            aria-hidden="true"
            className={`grid size-6 place-items-center rounded-full font-display text-[13px] font-bold ${tone.badge}`}
          >
            {personKey.toUpperCase()}
          </span>
          <span className={tone.text}>{nameLabel}</span>
          <span className="sr-only">({label})</span>
        </label>
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          maxLength={NAME_MAX * 6}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="h-full w-full min-w-0 flex-1 bg-transparent text-[20px] font-bold tracking-[0.02em] text-ink outline-none placeholder:text-[17px] placeholder:font-normal placeholder:text-ink-faint/70 md:text-[22px]"
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
