"use client";

import { RELATION_OPTIONS } from "@/data/relations";
import type { Relation } from "@/lib/analysis/types";

type RelationPickerProps = {
  value: Relation | null;
  error?: string;
  onChange: (value: Relation) => void;
};

/** 관계 선택: 모바일 4열 그리드, 데스크톱 한 줄 */
export function RelationPicker({ value, error, onChange }: RelationPickerProps) {
  return (
    <fieldset aria-describedby={error ? "relation-error" : "relation-note"}>
      <legend className="text-[13px] font-semibold text-ink">어떤 관계인가요?</legend>
      <div className="mt-1.5 grid grid-cols-4 gap-1.5 md:flex md:flex-wrap md:gap-2">
        {RELATION_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`relative inline-flex h-10 cursor-pointer items-center justify-center rounded-full border px-2 text-[14px] font-medium whitespace-nowrap transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink md:h-11 md:px-5 md:text-[15px] ${
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
          관계는 점수에 영향을 주지 않고, 리포트의 말투에만 반영돼요.
        </p>
      )}
    </fieldset>
  );
}
