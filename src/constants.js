export const PAPER_SIZES = [
  { id: 'A4',    label: 'A4',         widthMm: 210,   heightMm: 297,   note: '預設值、超商最常用' },
  { id: 'A3',    label: 'A3',         widthMm: 297,   heightMm: 420,   note: 'ibon / FamiPort 支援' },
  { id: 'B4',    label: 'B4 (JIS)',   widthMm: 257,   heightMm: 364,   note: 'ibon / FamiPort 支援' },
  { id: 'Letter',label: 'Letter',     widthMm: 215.9, heightMm: 279.4, note: '美規' },
  { id: '4x6',   label: '4×6 相片',   widthMm: 102,   heightMm: 152,   note: '常見沖印尺寸' },
  { id: '5x7',   label: '5×7 相片',   widthMm: 127,   heightMm: 178 },
  { id: '3.5x5', label: '3.5×5 相片', widthMm: 89,    heightMm: 127 },
  { id: 'custom',label: '自訂尺寸' },
]

export const LAYOUT_OPTIONS = [
  { value: 4, label: '4 張/頁' },
  { value: 6, label: '6 張/頁' },
]

export const OUTPUT_FORMATS = [
  { value: 'pdf', label: 'PDF（多頁合一）' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
]

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
export const ACCEPTED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']
