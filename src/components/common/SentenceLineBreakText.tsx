import { Fragment } from 'react';
import { planSentenceLineBreaks } from '@/utils/sentence-linebreak';

type SentenceLineBreakVariant = 'headline' | 'lead' | 'body' | 'caption';

interface SentenceLineBreakTextProps {
  text: string;
  className?: string;
  variant?: SentenceLineBreakVariant;
  mobileLines?: string[];
  desktopLines?: string[];
  mobileTarget?: number;
  desktopTarget?: number;
  minTokenCount?: number;
}

const VARIANT_TARGETS: Record<
  SentenceLineBreakVariant,
  { mobileTarget: number; desktopTarget: number; minTokenCount: number }
> = {
  headline: { mobileTarget: 13, desktopTarget: 22, minTokenCount: 3 },
  lead: { mobileTarget: 16, desktopTarget: 28, minTokenCount: 4 },
  body: { mobileTarget: 18, desktopTarget: 32, minTokenCount: 5 },
  caption: { mobileTarget: 14, desktopTarget: 24, minTokenCount: 4 },
};

const PLAN_CACHE = new Map<string, ReturnType<typeof planSentenceLineBreaks>>();
const PLAN_CACHE_MAX_SIZE = 320;

function resolvePlanWithCache(
  text: string,
  mobileTarget: number,
  desktopTarget: number,
  minTokenCount: number
) {
  const key = `${mobileTarget}|${desktopTarget}|${minTokenCount}|${text}`;
  const cached = PLAN_CACHE.get(key);
  if (cached) return cached;

  const computed = planSentenceLineBreaks(text, {
    mobileTarget,
    desktopTarget,
    minTokenCount,
  });

  if (PLAN_CACHE.size >= PLAN_CACHE_MAX_SIZE) {
    PLAN_CACHE.clear();
  }
  PLAN_CACHE.set(key, computed);
  return computed;
}

function renderLines(lines: string[]) {
  return lines.map((line, index) => (
    <Fragment key={`${index}-${line}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

function isSameLines(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function SentenceLineBreakText({
  text,
  className,
  variant = 'body',
  mobileLines,
  desktopLines,
  mobileTarget,
  desktopTarget,
  minTokenCount,
}: SentenceLineBreakTextProps) {
  const defaults = VARIANT_TARGETS[variant];
  const resolvedMobileTarget = mobileTarget ?? defaults.mobileTarget;
  const resolvedDesktopTarget = desktopTarget ?? defaults.desktopTarget;
  const resolvedMinTokenCount = minTokenCount ?? defaults.minTokenCount;
  const hasManualMobileLines = !!mobileLines && mobileLines.length > 0;
  const hasManualDesktopLines = !!desktopLines && desktopLines.length > 0;
  const hasManualLines = hasManualMobileLines || hasManualDesktopLines;
  const plan = hasManualLines
    ? null
    : resolvePlanWithCache(
        text,
        resolvedMobileTarget,
        resolvedDesktopTarget,
        resolvedMinTokenCount
      );

  const fallbackPlan =
    hasManualLines && (!hasManualMobileLines || !hasManualDesktopLines)
      ? resolvePlanWithCache(
          text,
          resolvedMobileTarget,
          resolvedDesktopTarget,
          resolvedMinTokenCount
        )
      : null;

  const resolvedMobileLines = hasManualMobileLines
    ? mobileLines
    : hasManualLines
      ? (fallbackPlan?.mobileLines ?? [text])
      : (plan?.mobileLines ?? [text]);
  const resolvedDesktopLines = hasManualDesktopLines
    ? desktopLines
    : hasManualLines
      ? (fallbackPlan?.desktopLines ?? [text])
      : (plan?.desktopLines ?? [text]);
  const shouldOptimize =
    resolvedMobileLines.length > 1 ||
    resolvedDesktopLines.length > 1 ||
    !isSameLines(resolvedMobileLines, resolvedDesktopLines);

  if (!shouldOptimize) {
    return <span className={className}>{text}</span>;
  }

  if (isSameLines(resolvedMobileLines, resolvedDesktopLines)) {
    return <span className={className}>{renderLines(resolvedMobileLines)}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="sentence-flow md:hidden">
        {renderLines(resolvedMobileLines)}
      </span>
      <span aria-hidden="true" className="sentence-flow hidden md:inline">
        {renderLines(resolvedDesktopLines)}
      </span>
    </span>
  );
}
