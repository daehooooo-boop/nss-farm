"use client";

import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NameField } from "@/components/analyze/NameField";
import { RelationPicker } from "@/components/analyze/RelationPicker";
import { AnalyzingScreen } from "@/components/analyze/AnalyzingScreen";
import { saveInput } from "@/lib/storage/session";
import { ENGINES } from "@/i18n/engine";
import { getDict } from "@/i18n/dict";
import { localePath, type Locale } from "@/i18n/locale";
import type { DraftInput, PersonFieldErrors, PersonInput, PersonKey, Relation } from "@/lib/analysis/types";

const EMPTY_PERSON: PersonInput = { name: "", hanja: "", meaning: "" };

type Touched = Record<PersonKey, Partial<Record<keyof PersonInput, boolean>>>;

export function AnalyzeForm({ locale = "ko" }: { locale?: Locale }) {
  const t = getDict(locale).form;
  const engine = ENGINES[locale];
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<DraftInput>({ a: EMPTY_PERSON, b: EMPTY_PERSON, relation: "friend" });
  const [touched, setTouched] = useState<Touched>({ a: {}, b: {} });
  const [submitted, setSubmitted] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [steps, setSteps] = useState<string[] | null>(null);
  const goToResult = useCallback(() => router.push(localePath(locale, "/result")), [router, locale]);

  const result = useMemo(() => engine.validate(draft), [engine, draft]);
  const labels = engine.personLabels(draft.relation);

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
    if (!saveInput(result.value, locale)) {
      setStorageError(true);
      return;
    }
    // 엔진은 결과 화면에서 즉시 계산된다. 진행 화면은 실제 단계(분해 → 발음 → 리포트)를 짧게 보여줄 뿐이다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      goToResult();
      return;
    }
    setSteps([...t.steps]);
  }

  const relationError = submitted && !result.ok ? result.errors.relation : undefined;
  const errors = { a: visibleErrors("a"), b: visibleErrors("b") };

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-3 md:max-w-[640px] md:space-y-6">
      <div className="grid gap-2 md:gap-3">
        <NameField
          personKey="a"
          label={labels.a}
          value={draft.a.name}
          placeholder={t.placeholderA}
          nameLabel={t.nameLabel}
          error={errors.a.name}
          onChange={(v) => update("a", "name", v)}
          onBlur={() => blur("a", "name")}
        />
        <NameField
          personKey="b"
          label={labels.b}
          value={draft.b.name}
          placeholder={draft.relation === "pet" ? t.placeholderPet : t.placeholderB}
          nameLabel={t.nameLabel}
          error={errors.b.name}
          onChange={(v) => update("b", "name", v)}
          onBlur={() => blur("b", "name")}
        />
      </div>


      <RelationPicker
        value={draft.relation}
        error={relationError}
        onChange={selectRelation}
        options={engine.relationOptions}
        legend={t.relationLegend}
        note={t.relationNote}
      />

      <div className="pt-0.5 md:flex md:items-center md:justify-between md:gap-6 md:pt-2">
        <Button
          type="submit"
          aria-disabled={!result.ok}
          size="cta"
          className={`w-full md:order-2 md:w-auto md:min-w-[220px] ${result.ok ? "" : "opacity-40"}`}
          icon={<ArrowRight size={20} strokeWidth={1.75} aria-hidden />}
        >
          {t.submit}
        </Button>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-ink-faint md:order-1 md:mt-0 md:text-[13px]">
          <Lock size={13} strokeWidth={1.75} aria-hidden />
          {t.lockNote}
        </p>
      </div>
      {storageError ? (
        <p role="alert" className="text-[13px] text-danger">
          {t.storageError}
        </p>
      ) : null}
      {steps ? <AnalyzingScreen steps={steps} onDone={goToResult} ariaLabel={t.analyzingAria} /> : null}
    </form>
  );
}
