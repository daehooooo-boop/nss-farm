"use client";

import type { RelationOption } from "@/data/relations";
import type { Relation } from "@/lib/analysis/types";

type RelationPickerProps = {
  value: Relation | null;
  error?: string;
  onChange: (value: Relation) => void;
  options: RelationOption[];
  legend: string;
  note: string;
};

/** 관계 선택: 모바일 4열 그리드, 데스크톱 한 줄 */
export function RelationPicker({ value, error, onChange, options, legend, note }: RelationPickerProps) {
  return (
    <fieldset aria-describedby={error ? "relation-error" : "relation-note"}>
      <legend className="sr-only">{legend}</legend>
      <div className="grid grid-cols-4 gap-1.5 md:flex md:flex-wrap md:gap-2">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`relative inline-flex h-9 cursor-pointer items-center justify-center rounded-full border px-2 text-[14px] font-medium whitespace-nowrap transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink md:h-11 md:px-5 md:text-[15px] ${
                checked ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface text-ink hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name="relation"
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id="relation-error" role="alert" className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : (
        <p id="relation-note" className="sr-only">
          {note}
        </p>
      )}
    </fieldset>
  );
}
