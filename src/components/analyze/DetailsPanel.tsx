"use client";

import { useId, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { TextField } from "@/components/ui/TextField";
import { MEANING_MAX } from "@/lib/analysis/constants";
import type { DraftInput, PersonFieldErrors, PersonInput, PersonKey } from "@/lib/analysis/types";

type DetailsPanelProps = {
  draft: DraftInput;
  labels: Record<PersonKey, string>;
  errors: Record<PersonKey, PersonFieldErrors>;
  onChange: (key: PersonKey, field: keyof PersonInput, value: string) => void;
  onBlur: (key: PersonKey, field: keyof PersonInput) => void;
};

/** 선택 입력(이름의 뜻)은 하나의 토글 뒤에 접어 둔다. 한자 입력은 2026-11-15 화면에서 뺐다. */
export function DetailsPanel({ draft, labels, errors, onChange, onBlur }: DetailsPanelProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const hasError = (["a", "b"] as const).some((k) => errors[k].meaning);
  const expanded = open || hasError;

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-8 items-center gap-1.5 text-[13px] font-semibold text-ink-soft hover:text-ink"
      >
        {expanded ? <Minus size={15} strokeWidth={2} aria-hidden /> : <Plus size={15} strokeWidth={2} aria-hidden />}
        이름의 뜻 더하기 <span className="font-normal text-ink-faint">(선택 · 의미까지 분석)</span>
      </button>

      <div id={panelId} hidden={!expanded} className="mt-2 grid gap-3 md:grid-cols-2">
        {(["a", "b"] as const).map((key) => (
          <div
            key={key}
            className={`space-y-2 rounded-[var(--radius-field)] p-4 ${key === "a" ? "bg-person-a-tint" : "bg-person-b-tint"}`}
          >
            <p className={`text-[13px] font-semibold ${key === "a" ? "text-person-a" : "text-person-b"}`}>
              {key.toUpperCase()} · {labels[key]}
            </p>
            <TextField
              label="이름에 담긴 뜻"
              accent={key}
              value={draft[key].meaning}
              placeholder="예: 여름처럼 밝고 진실한 사람"
              autoComplete="off"
              counter={{ value: draft[key].meaning.trim().length, max: MEANING_MAX }}
              error={errors[key].meaning}
              onChange={(e) => onChange(key, "meaning", e.target.value)}
              onBlur={() => onBlur(key, "meaning")}
            />
          </div>
        ))}
        <p className="text-[12px] leading-[1.5] text-ink-faint md:col-span-2">
          알고 있는 이름의 뜻을 적어 주시면 두 이름의 의미까지 비교해요.
        </p>
      </div>
    </div>
  );
}
