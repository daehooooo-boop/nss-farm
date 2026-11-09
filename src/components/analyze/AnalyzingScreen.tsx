"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { SynergyMark } from "@/components/ui/SynergyMark";

export const STEP_MS = 450;

/** 분석 진행 화면 — 실제 엔진 단계에 대응하는 짧은 문구 (PRD 4.3), 최대 약 2초 */
export function AnalyzingScreen({ steps, onDone }: { steps: string[]; onDone: () => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= steps.length) {
      onDone();
      return;
    }
    const id = setTimeout(() => setCurrent((c) => c + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [current, steps.length, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/95 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="이름 분석 중">
      <div className="w-full max-w-[420px]">
        <SynergyMark size={64} className="animate-pulse motion-reduce:animate-none" />
        <ol className="mt-10 space-y-4" aria-live="polite">
          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li
                key={step}
                className={`flex items-center gap-3 text-[16px] transition-opacity duration-300 ${
                  done ? "text-ink-soft" : active ? "font-semibold text-ink" : "text-ink-faint/50"
                }`}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${done ? "border-ink bg-ink text-paper" : "border-line-strong"}`}>
                  {done ? <Check size={14} strokeWidth={2.5} aria-hidden /> : null}
                </span>
                {step}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
