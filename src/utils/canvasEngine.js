import { PAPER_SIZES } from '../constants'

export function getPaperDimensions(settings) {
  if (settings.paperSize === 'custom') {
    let w = settings.customWidthMm || 210
    let h = settings.customHeightMm || 297
    if (settings.orientation === 'landscape') [w, h] = [h, w]
    return { widthMm: w, heightMm: h }
  }
  const paper = PAPER_SIZES.find(p => p.id === settings.paperSize)
  let { widthMm, heightMm } = paper
  if (settings.orientation === 'landscape') [widthMm, heightMm] = [heightMm, widthMm]
  return { widthMm, heightMm }
}

export function getGridLayout(photosPerPage, orientation) {
  if (photosPerPage === 4) return { cols: 2, rows: 2 }
  if (photosPerPage === 6) {
    return orientation === 'portrait' ? { cols: 2, rows: 3 } : { cols: 3, rows: 2 }
  }
  // Parametric fallback for future extension
  const cols = Math.ceil(Math.sqrt(photosPerPage))
  const rows = Math.ceil(photosPerPage / cols)
  return { cols, rows }
}

function drawPhotoContain(ctx, photo, cellX, cellY, cellW, cellH) {
  const img = photo.imageEl
  const rotation = photo.rotation || 0
  const srcW = img.naturalWidth
  const srcH = img.naturalHeight

  // Effective display size after rotation (90/270 swaps axes)
  const isSwapped = rotation === 90 || rotation === 270
  const effW = isSwapped ? srcH : srcW
  const effH = isSwapped ? srcW : srcH

  // Scale to contain within cell
  const scale = Math.min(cellW / effW, cellH / effH)
  const drawEffW = effW * scale
  const drawEffH = effH * scale

  // Center in cell
  const centerX = cellX + (cellW - drawEffW) / 2 + drawEffW / 2
  const centerY = cellY + (cellH - drawEffH) / 2 + drawEffH / 2

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(img, -(srcW * scale) / 2, -(srcH * scale) / 2, srcW * scale, srcH * scale)
  ctx.restore()
}

/**
 * Render one page onto a canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {Array} photos - all photos
 * @param {Object} settings
 * @param {number} pageIndex - 0-based
 * @param {number|null} maxWidth - if set, scale canvas to this width (for preview)
 */
export function renderPage(canvas, photos, settings, pageIndex, maxWidth = null) {
  const { widthMm, heightMm } = getPaperDimensions(settings)
  const dpi = settings.dpi
  const mmToPx = mm => (mm / 25.4) * dpi

  const fullW = Math.round(mmToPx(widthMm))
  const fullH = Math.round(mmToPx(heightMm))

  const scale = maxWidth ? maxWidth / fullW : 1
  const W = Math.round(fullW * scale)
  const H = Math.round(fullH * scale)

  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  const { cols, rows } = getGridLayout(settings.photosPerPage, settings.orientation)
  const marginPx = mmToPx(settings.marginMm) * scale
  const gapPx = mmToPx(settings.gapMm) * scale

  const availW = W - 2 * marginPx
  const availH = H - 2 * marginPx
  const cellW = (availW - (cols - 1) * gapPx) / cols
  const cellH = (availH - (rows - 1) * gapPx) / rows

  const startIdx = pageIndex * settings.photosPerPage
  const pagePhotos = photos.slice(startIdx, startIdx + settings.photosPerPage)

  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = marginPx + col * (cellW + gapPx)
    const y = marginPx + row * (cellH + gapPx)

    if (i < pagePhotos.length && pagePhotos[i].imageEl) {
      drawPhotoContain(ctx, pagePhotos[i], x, y, cellW, cellH)
    }
  }
}
