interface BrandTheme {
  primary: string;
  accent: string;
}

const BRAND_THEME_MAP: Record<string, BrandTheme> = {
  asics: { primary: '#003DA5', accent: '#00D1FF' },
  nike: { primary: '#F7461C', accent: '#FF8A65' },
  adidas: { primary: '#1428A0', accent: '#5B7CFF' },
};

export function getBrandTheme(brandId: string, fallbackPrimary = '#003DA5'): BrandTheme {
  const mapped = BRAND_THEME_MAP[brandId];
  if (mapped) return mapped;
  return { primary: fallbackPrimary, accent: '#00D1FF' };
}

export function getBrandThemeVars(brandId: string, fallbackPrimary?: string): Record<string, string> {
  const theme = getBrandTheme(brandId, fallbackPrimary);
  return {
    '--color-asics-blue': theme.primary,
    '--color-asics-accent': theme.accent,
    '--color-asics-glow': `${theme.accent}33`,
  };
}
