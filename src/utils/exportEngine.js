import { renderPage, getPaperDimensions } from './canvasEngine'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function buildFilename(settings, ext) {
  return `照片排版_${settings.paperSize}_${settings.photosPerPage}張_${todayStr()}.${ext}`
}

function renderFullPage(photos, settings, pageIndex) {
  const canvas = document.createElement('canvas')
  renderPage(canvas, photos, settings, pageIndex, null)
  return canvas
}

async function canvasToBlob(canvas, format, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))),
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      format === 'jpg' ? quality : undefined
    )
  })
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

async function exportPDF(photos, settings, onProgress) {
  const { jsPDF } = await import('jspdf')
  const { widthMm, heightMm } = getPaperDimensions(settings)
  const totalPages = Math.ceil(photos.length / settings.photosPerPage)

  const pdf = new jsPDF({
    orientation: settings.orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: [widthMm, heightMm],
    compress: true,
  })

  for (let i = 0; i < totalPages; i++) {
    onProgress(`產生第 ${i + 1} / ${totalPages} 頁...`)
    if (i > 0) pdf.addPage([widthMm, heightMm], settings.orientation === 'landscape' ? 'l' : 'p')
    const canvas = renderFullPage(photos, settings, i)
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST')
  }

  onProgress('儲存 PDF...')
  pdf.save(buildFilename(settings, 'pdf'))
}

async function exportImages(photos, settings, format, onProgress) {
  const totalPages = Math.ceil(photos.length / settings.photosPerPage)
  const quality = settings.jpgQuality

  if (totalPages === 1) {
    onProgress('產生圖片...')
    const canvas = renderFullPage(photos, settings, 0)
    const blob = await canvasToBlob(canvas, format, quality)
    downloadBlob(blob, buildFilename(settings, format === 'jpg' ? 'jpg' : 'png'))
    return
  }

  onProgress('產生圖片並壓縮...')
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const base = buildFilename(settings, format).replace(`.${format}`, '')

  for (let i = 0; i < totalPages; i++) {
    onProgress(`產生第 ${i + 1} / ${totalPages} 頁...`)
    const canvas = renderFullPage(photos, settings, i)
    const blob = await canvasToBlob(canvas, format, quality)
    zip.file(`${base}_p${i + 1}.${format}`, blob)
  }

  onProgress('壓縮中...')
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(zipBlob, `${base}.zip`)
}

export async function exportFiles(photos, settings, onProgress) {
  if (settings.outputFormat === 'pdf') {
    await exportPDF(photos, settings, onProgress)
  } else {
    await exportImages(photos, settings, settings.outputFormat, onProgress)
  }
}
