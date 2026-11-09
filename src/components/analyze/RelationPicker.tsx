"use client";

import { RELATION_OPTIONS } from "@/data/relations";
import type { Relation } from "@/lib/analysis/types";

type RelationPickerProps = {
  value: Relation | null;
  error?: string;
  onChange: (value: Relation) => void;
};

export function RelationPicker({ value, error, onChange }: RelationPickerProps) {
  return (
    <fieldset aria-describedby={error ? "relation-error" : undefined}>
      <legend className="text-[14px] font-semibold text-ink">어떤 관계인가요?</legend>
      <p className="mt-1 text-[13px] text-ink-faint">관계는 점수에 영향을 주지 않고, 리포트의 말투에만 반영돼요.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {RELATION_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`relative inline-flex h-11 cursor-pointer items-center rounded-full border px-5 text-[15px] font-medium transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
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
        <p id="relation-error" role="alert" className="mt-3 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
