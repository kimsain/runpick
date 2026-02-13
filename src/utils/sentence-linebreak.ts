type BreakStrength = 'soft' | 'clause' | 'sentence';

interface Token {
  raw: string;
  normalized: string;
  width: number;
  breakStrength: BreakStrength;
}

interface SegmentPlan {
  lines: string[];
  cost: number;
}

export interface SentenceLineBreakPlan {
  shouldOptimize: boolean;
  mobileLines: string[];
  desktopLines: string[];
}

export interface SentenceLineBreakOptions {
  mobileTarget?: number;
  desktopTarget?: number;
  minTokenCount?: number;
}

const SPACE_WIDTH = 0.34;
const HARD_OVERFLOW_MULTIPLIER = 1.2;
const MAX_SLACK_MULTIPLIER = 1.9;

const KO_WEAK_ENDING_RE =
  /(?:은|는|이|가|을|를|의|에|와|과|도|만|로|으로|에서|에게|께|부터|까지|처럼|보다|및|또는)$/u;
const KO_SENTENCE_ENDING_RE =
  /(?:니다|습니다|했다|한다|된다|됐다|였다|이다|다|요|죠|까)$/u;

const EN_WEAK_ENDINGS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'from',
  'in',
  'into',
  'of',
  'on',
  'or',
  'the',
  'to',
  'via',
  'with',
]);

function normalizeToken(raw: string): string {
  return raw
    .replace(/^[('"[\]{}"“‘]+/u, '')
    .replace(/[)"'\]{}"”’]+$/u, '')
    .replace(/[.,!?;:…]+$/u, '')
    .trim();
}

function estimateCharWidth(ch: string): number {
  if (/\s/u.test(ch)) return SPACE_WIDTH;
  if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/u.test(ch)) return 1;
  if (/[\u3040-\u30ff\u3400-\u9fff]/u.test(ch)) return 1;
  if (/[A-Z]/u.test(ch)) return 0.66;
  if (/[a-z]/u.test(ch)) return 0.56;
  if (/[0-9]/u.test(ch)) return 0.6;
  if (/[.,!?;:…]/u.test(ch)) return 0.33;
  if (/[-/]/u.test(ch)) return 0.45;
  return 0.72;
}

function estimateTokenWidth(token: string): number {
  let width = 0;
  for (const ch of token) {
    width += estimateCharWidth(ch);
  }
  return width;
}

function detectBreakStrength(raw: string, normalized: string): BreakStrength {
  if (/[.!?…][)"'\]{}"”’]*$/u.test(raw)) return 'sentence';
  if (/[,:;·][)"'\]{}"”’]*$/u.test(raw)) return 'clause';
  if (KO_SENTENCE_ENDING_RE.test(normalized)) return 'sentence';
  return 'soft';
}

function tokenize(text: string): Token[] {
  const compact = text.replace(/\s+/gu, ' ').trim();
  if (!compact) return [];

  return compact.split(' ').map((raw) => {
    const normalized = normalizeToken(raw);
    return {
      raw,
      normalized,
      width: estimateTokenWidth(raw),
      breakStrength: detectBreakStrength(raw, normalized),
    };
  });
}

function countLanguageMix(text: string) {
  const compact = text.replace(/\s+/gu, '');
  let ko = 0;
  let en = 0;
  for (const ch of compact) {
    if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/u.test(ch)) {
      ko += 1;
    } else if (/[A-Za-z]/u.test(ch)) {
      en += 1;
    }
  }
  return { ko, en };
}

function resolveTargets(text: string, options: SentenceLineBreakOptions) {
  const { ko, en } = countLanguageMix(text);
  const isMixed = ko > 0 && en > 0;
  const isMostlyKorean = ko >= en;
  const mobileTarget =
    options.mobileTarget ??
    (isMixed ? 17 : isMostlyKorean ? 18 : 14);
  const desktopTarget =
    options.desktopTarget ??
    (isMixed ? 29 : isMostlyKorean ? 32 : 24);
  return { mobileTarget, desktopTarget };
}

function isWeakKoreanEnding(word: string): boolean {
  return KO_WEAK_ENDING_RE.test(word);
}

function isWeakEnglishEnding(word: string): boolean {
  return EN_WEAK_ENDINGS.has(word.toLowerCase());
}

function startsWithClosingPunctuation(word: string): boolean {
  return /^[),.;:!?]/u.test(word);
}

function endsWithOpeningPunctuation(word: string): boolean {
  return /[(\[{]$/u.test(word);
}

function createPrefixWidths(tokens: Token[]): number[] {
  const prefix = [0];
  for (const token of tokens) {
    prefix.push(prefix[prefix.length - 1] + token.width);
  }
  return prefix;
}

function calculateLineWidth(prefix: number[], start: number, end: number): number {
  const tokenWidth = prefix[end + 1] - prefix[start];
  const spaces = end - start;
  return tokenWidth + Math.max(spaces, 0) * SPACE_WIDTH;
}

function calculateLineCost(
  tokens: Token[],
  start: number,
  end: number,
  width: number,
  targetWidth: number
): number {
  const isLastLine = end === tokens.length - 1;
  const slack = targetWidth - width;
  let cost = 0;

  if (slack < 0) {
    const overflow = Math.abs(slack);
    cost += 220 + overflow * 150;
  } else {
    cost += slack * slack;
  }

  if (!isLastLine && width < targetWidth * 0.45) {
    cost += 46;
  }

  if (isLastLine && width < targetWidth * 0.32) {
    cost += 26;
  }

  const lineStart = tokens[start];
  const lineEnd = tokens[end];

  if (startsWithClosingPunctuation(lineStart.raw)) {
    cost += 120;
  }

  if (endsWithOpeningPunctuation(lineEnd.raw)) {
    cost += 70;
  }

  if (!isLastLine) {
    if (lineEnd.breakStrength === 'sentence') {
      cost -= 34;
    } else if (lineEnd.breakStrength === 'clause') {
      cost -= 13;
    }
  }

  if (isWeakKoreanEnding(lineEnd.normalized)) {
    cost += 32;
  }

  if (isWeakEnglishEnding(lineEnd.normalized)) {
    cost += 20;
  }

  return Math.max(cost, 0);
}

function planSegmentLines(tokens: Token[], targetWidth: number): SegmentPlan {
  const n = tokens.length;
  if (n === 0) return { lines: [], cost: 0 };

  const prefix = createPrefixWidths(tokens);
  const costs = new Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
  const nextIndex = new Array<number>(n + 1).fill(-1);
  costs[n] = 0;
  nextIndex[n] = n;

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = i; j < n; j += 1) {
      const width = calculateLineWidth(prefix, i, j);
      if (width > targetWidth * HARD_OVERFLOW_MULTIPLIER) break;
      if (width < targetWidth / MAX_SLACK_MULTIPLIER && j !== n - 1) continue;

      const lineCost = calculateLineCost(tokens, i, j, width, targetWidth);
      const candidate = lineCost + costs[j + 1];
      if (candidate < costs[i]) {
        costs[i] = candidate;
        nextIndex[i] = j + 1;
      }
    }
  }

  if (!Number.isFinite(costs[0]) || nextIndex[0] < 0) {
    return {
      lines: [tokens.map((token) => token.raw).join(' ')],
      cost: Number.POSITIVE_INFINITY,
    };
  }

  const lines: string[] = [];
  let cursor = 0;
  while (cursor < n) {
    const next = nextIndex[cursor];
    if (next <= cursor || next > n) {
      lines.push(tokens.slice(cursor).map((token) => token.raw).join(' '));
      break;
    }
    lines.push(tokens.slice(cursor, next).map((token) => token.raw).join(' '));
    cursor = next;
  }

  return {
    lines,
    cost: costs[0],
  };
}

function isEquivalentPlan(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function planSentenceLineBreaks(
  text: string,
  options: SentenceLineBreakOptions = {}
): SentenceLineBreakPlan {
  const tokens = tokenize(text);
  const minTokenCount = options.minTokenCount ?? 7;

  if (tokens.length < minTokenCount) {
    const compact = tokens.map((token) => token.raw).join(' ');
    return {
      shouldOptimize: false,
      mobileLines: compact ? [compact] : [text],
      desktopLines: compact ? [compact] : [text],
    };
  }

  const { mobileTarget, desktopTarget } = resolveTargets(text, options);
  const mobilePlan = planSegmentLines(tokens, mobileTarget);
  const desktopPlan = planSegmentLines(tokens, desktopTarget);
  const shouldOptimize =
    mobilePlan.lines.length > 1 ||
    desktopPlan.lines.length > 1 ||
    !isEquivalentPlan(mobilePlan.lines, desktopPlan.lines);

  return {
    shouldOptimize,
    mobileLines: mobilePlan.lines,
    desktopLines: desktopPlan.lines,
  };
}
