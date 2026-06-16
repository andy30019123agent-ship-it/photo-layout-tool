import { ACCEPTED_EXTS } from '../constants'

function isHeic(file) {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')
  )
}

function isAccepted(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  return ACCEPTED_EXTS.includes(ext) || file.type.startsWith('image/')
}

async function blobToOrientedDataUrl(blob) {
  // Use createImageBitmap with imageOrientation to respect EXIF rotation
  let bitmap
  try {
    bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' })
  } catch {
    bitmap = await createImageBitmap(blob)
  }

  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d').drawImage(bitmap, 0, 0)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.92)
}

async function createImageEl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('圖片載入失敗'))
    img.src = dataUrl
  })
}

export async function loadImageFile(file) {
  if (!isAccepted(file)) {
    throw new Error('不支援的檔案格式')
  }

  let blob = file

  if (isHeic(file)) {
    try {
      const heic2any = (await import('heic2any')).default
      const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
      blob = Array.isArray(converted) ? converted[0] : converted
    } catch {
      throw new Error('HEIC 轉檔失敗，請改用 JPG 或 PNG')
    }
  }

  const dataUrl = await blobToOrientedDataUrl(blob)
  const imageEl = await createImageEl(dataUrl)

  return {
    id: crypto.randomUUID(),
    name: file.name,
    dataUrl,
    imageEl,
    rotation: 0,
  }
}
