"use client";

import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PersonCard } from "@/components/analyze/PersonCard";
import { RelationPicker } from "@/components/analyze/RelationPicker";
import { AnalyzingScreen } from "@/components/analyze/AnalyzingScreen";
import { analyzeNames } from "@/lib/analysis";
import { personLabels } from "@/data/relations";
import { nameMinLength, validateInput } from "@/lib/analysis/validate";
import { saveInput } from "@/lib/storage/session";
import type { DraftInput, PersonFieldErrors, PersonInput, PersonKey, Relation } from "@/lib/analysis/types";

const EMPTY_PERSON: PersonInput = { name: "", hanja: "", meaning: "" };

type Touched = Record<PersonKey, Partial<Record<keyof PersonInput, boolean>>>;

export function AnalyzeForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<DraftInput>({ a: EMPTY_PERSON, b: EMPTY_PERSON, relation: null });
  const [touched, setTouched] = useState<Touched>({ a: {}, b: {} });
  const [submitted, setSubmitted] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [steps, setSteps] = useState<string[] | null>(null);
  const goToResult = useCallback(() => router.push("/result"), [router]);

  const result = useMemo(() => validateInput(draft), [draft]);
  const labels = personLabels(draft.relation);

  /** 오류는 필드를 떠났거나 제출을 시도한 뒤에만 보여준다 (PRD 4.2) */
  function visibleErrors(key: PersonKey): PersonFieldErrors {
    if (result.ok) return {};
    const all = result.errors[key];
    const shown: PersonFieldErrors = {};
    for (const field of Object.keys(all) as (keyof PersonInput)[]) {
      if (submitted || touched[key][field]) shown[field] = all[field];
    }
    return shown;
  }

  function update(key: PersonKey, field: keyof PersonInput, value: string) {
    setDraft((d) => ({ ...d, [key]: { ...d[key], [field]: value } }));
  }

  function blur(key: PersonKey, field: keyof PersonInput) {
    setTouched((t) => ({ ...t, [key]: { ...t[key], [field]: true } }));
  }

  function selectRelation(relation: Relation) {
    setDraft((d) => ({ ...d, relation }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!result.ok) {
      // 첫 번째 오류 위치로 이동
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
        first?.scrollIntoView({ block: "center", behavior: "smooth" });
        if (first instanceof HTMLInputElement) first.focus({ preventScroll: true });
      });
      return;
    }
    if (!saveInput(result.value)) {
      setStorageError(true);
      return;
    }
    // 엔진은 즉시 계산된다. 진행 화면은 실제 단계(분해 → 발음 → 의미 → 리포트)를 짧게 보여줄 뿐이다.
    const analysis = analyzeNames(result.value);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      goToResult();
      return;
    }
    setSteps([
      "두 사람의 이름을 살펴보고 있습니다.",
      "이름의 울림을 비교하고 있습니다.",
      ...(analysis.sections.meaning.status === "available" ? ["이름에 담긴 의미를 연결하고 있습니다."] : []),
      "두 사람만의 조화로운 이야기를 만들고 있습니다.",
    ]);
  }

  const relationError = submitted && !result.ok ? result.errors.relation : undefined;

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-10">
      <RelationPicker value={draft.relation} error={relationError} onChange={selectRelation} />

      <div className="relative grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-6">
        {(["a", "b"] as const).map((key) => (
          <PersonCard
            key={key}
            personKey={key}
            label={labels[key]}
            value={draft[key]}
            minLength={nameMinLength(key, draft.relation)}
            errors={visibleErrors(key)}
            warnings={result.warnings[key]}
            onChange={(field, value) => update(key, field, value)}
            onBlur={(field) => blur(key, field)}
          />
        ))}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 hidden size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper font-display text-2xl italic text-ink-soft lg:grid"
        >
          ×
        </span>
      </div>

      <div className="flex flex-col items-stretch gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-1.5 text-[13px] text-ink-faint">
          <Lock size={14} strokeWidth={1.75} aria-hidden />
          입력한 이름은 저장되지 않고 이 브라우저 안에서만 분석돼요.
        </p>
        <Button
          type="submit"
          aria-disabled={!result.ok}
          className={result.ok ? "" : "opacity-40"}
          icon={<ArrowRight size={20} strokeWidth={1.75} aria-hidden />}
        >
          분석 시작하기
        </Button>
      </div>
      {storageError ? (
        <p role="alert" className="text-[13px] text-danger">
          이 브라우저에서 임시 저장을 사용할 수 없어 결과를 열 수 없어요. 개인정보 보호 모드를 끄고 다시 시도해 주세요.
        </p>
      ) : null}
      {steps ? <AnalyzingScreen steps={steps} onDone={goToResult} /> : null}
    </form>
  );
}
