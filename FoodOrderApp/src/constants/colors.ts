// GrubHub-inspired colour system
const Colors = {
  // ── Brand ─────────────────────────────────────────────
  primary:      '#F15A22',   // signature orange-red
  primaryDark:  '#C94810',   // pressed / dark variant
  primaryLight: '#FF7F4F',   // tinted highlight

  accent: '#FFB347',         // warm amber – stars, accents

  // ── Surfaces ──────────────────────────────────────────
  background:  '#F2F2F2',    // page background (light gray)
  surface:     '#FFFFFF',    // card / sheet white
  surfaceAlt:  '#F8F8F8',    // slightly-off-white alternate

  // ── Text ──────────────────────────────────────────────
  text:          '#111111',  // near-black headings
  textSecondary: '#555555',  // body / meta text
  textMuted:     '#AAAAAA',  // placeholder / disabled
  textInverse:   '#FFFFFF',  // on coloured backgrounds

  // ── Borders & dividers ────────────────────────────────
  border:  '#E0E0E0',
  divider: '#EEEEEE',

  // ── Semantic ──────────────────────────────────────────
  success: '#27AE60',
  warning: '#F39C12',
  error:   '#E74C3C',
  info:    '#2980B9',

  // ── Order status ──────────────────────────────────────
  statusPlaced:          '#2980B9',
  statusPreparing:       '#F39C12',
  statusOutForDelivery:  '#8E44AD',
  statusDelivered:       '#27AE60',

  // ── Misc ──────────────────────────────────────────────
  overlay:     'rgba(0,0,0,0.55)',
  shadowColor: '#000000',
};

export default Colors;
