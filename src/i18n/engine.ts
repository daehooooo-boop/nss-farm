/** 언어별 분석 엔진·데이터 묶음. 같은 언어 안에서는 항상 같은 결과를 낸다. */
import { analyzeNames } from "@/lib/analysis";
import { validateInput } from "@/lib/analysis/validate";
import { analyzeNamesEn } from "@/lib/analysis-en";
import { validateInputEn } from "@/lib/analysis-en/validate";
import { buildReport, type Report } from "@/lib/report/buildReport";
import { buildReportEn } from "@/lib/report/buildReportEn";
import { RELATION_OPTIONS, personLabels, relationOption, type RelationOption } from "@/data/relations";
import { RELATION_TYPES, type RelationTypeCode, type RelationTypeInfo } from "@/data/relationTypes";
import { RELATION_OPTIONS_EN, RELATION_TYPES_EN, personLabelsEn, relationOptionEn } from "@/data/en/relations";
import type { AnalysisInput, AnalysisResult, DraftInput, Relation, ValidationResult } from "@/lib/analysis/types";
import type { Locale } from "@/i18n/locale";

export type Engine = {
  analyze: (input: AnalysisInput) => AnalysisResult;
  validate: (draft: DraftInput) => ValidationResult;
  report: (result: AnalysisResult) => Report;
  relationOptions: RelationOption[];
  relationOption: (value: Relation) => RelationOption;
  personLabels: (relation: Relation | null) => { a: string; b: string };
  relationTypes: Record<RelationTypeCode, RelationTypeInfo>;
};

export const ENGINES: Record<Locale, Engine> = {
  ko: {
    analyze: analyzeNames,
    validate: validateInput,
    report: buildReport,
    relationOptions: RELATION_OPTIONS,
    relationOption,
    personLabels,
    relationTypes: RELATION_TYPES,
  },
  en: {
    analyze: analyzeNamesEn,
    validate: validateInputEn,
    report: buildReportEn,
    relationOptions: RELATION_OPTIONS_EN,
    relationOption: relationOptionEn,
    personLabels: personLabelsEn,
    relationTypes: RELATION_TYPES_EN,
  },
};
