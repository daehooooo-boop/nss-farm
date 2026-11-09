"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { MEANING_MAX, NAME_MAX } from "@/lib/analysis/constants";
import type { PersonFieldErrors, PersonInput, PersonKey } from "@/lib/analysis/types";

type PersonCardProps = {
  personKey: PersonKey;
  label: string;
  value: PersonInput;
  minLength: number;
  errors: PersonFieldErrors;
  warnings: PersonFieldErrors;
  onChange: (field: keyof PersonInput, value: string) => void;
  onBlur: (field: keyof PersonInput) => void;
};

const TONE = {
  a: { badge: "bg-person-a text-paper", tint: "bg-person-a-tint", text: "text-person-a" },
  b: { badge: "bg-person-b text-paper", tint: "bg-person-b-tint", text: "text-person-b" },
} as const;

export function PersonCard({ personKey, label, value, minLength, errors, warnings, onChange, onBlur }: PersonCardProps) {
  const tone = TONE[personKey];
  const panelId = useId();
  const hasDetails = value.hanja.length > 0 || value.meaning.length > 0;
  const [open, setOpen] = useState(hasDetails);
  const detailsOpen = open || Boolean(errors.hanja || errors.meaning);

  return (
    <fieldset className="rounded-[var(--radius-card)] border border-line bg-surface p-5 md:p-7">
      <legend className="sr-only">{label}</legend>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className={`grid size-8 place-items-center rounded-full font-display text-lg ${tone.badge}`}>
          {personKey.toUpperCase()}
        </span>
        <span className={`text-[15px] font-semibold ${tone.text}`}>{label}</span>
      </div>

      <TextField
        className="mt-5"
        label="이름"
        size="lg"
        accent={personKey}
        value={value.name}
        placeholder={personKey === "a" ? "예: 김하윤" : "예: 이도현"}
        autoComplete="off"
        maxLength={NAME_MAX + 4}
        hint={minLength === 1 ? "한글 1~5자 · 한 글자 이름도 괜찮아요" : "한글 2~5자 · 성을 넣어도, 빼도 괜찮아요"}
        error={errors.name}
        onChange={(e) => onChange("name", e.target.value)}
        onBlur={() => onBlur("name")}
      />

      <button
        type="button"
        aria-expanded={detailsOpen}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="mt-5 flex min-h-11 w-full items-center justify-between rounded-[var(--radius-field)] px-1 text-left text-[14px] font-semibold text-ink-soft hover:text-ink"
      >
        <span>
          한자 · 이름의 뜻 더하기 <span className="font-normal text-ink-faint">(선택)</span>
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          aria-hidden
          className={`transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div id={panelId} hidden={!detailsOpen} className={`mt-3 space-y-5 rounded-[var(--radius-field)] p-4 ${tone.tint}`}>
        <TextField
          label="한자"
          accent={personKey}
          value={value.hanja}
          placeholder="예: 夏允"
          autoComplete="off"
          error={errors.hanja}
          warning={warnings.hanja}
          onChange={(e) => onChange("hanja", e.target.value)}
          onBlur={() => onBlur("hanja")}
        />
        <TextField
          label="이름에 담긴 뜻"
          accent={personKey}
          value={value.meaning}
          placeholder="예: 여름처럼 밝고 진실한 사람"
          autoComplete="off"
          counter={{ value: value.meaning.trim().length, max: MEANING_MAX }}
          hint="한자의 뜻은 자동으로 풀지 않아요. 알고 있는 뜻을 직접 적어 주시면 의미까지 분석해요."
          error={errors.meaning}
          onChange={(e) => onChange("meaning", e.target.value)}
          onBlur={() => onBlur("meaning")}
        />
      </div>
    </fieldset>
  );
}
