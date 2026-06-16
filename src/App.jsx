import { useState, useEffect, useCallback } from 'react'
import UploadZone from './components/UploadZone'
import ThumbnailList from './components/ThumbnailList'
import SettingsPanel from './components/SettingsPanel'
import PreviewPanel from './components/PreviewPanel'
import { loadImageFile } from './utils/imageLoader'
import { exportFiles } from './utils/exportEngine'

const DEFAULT_SETTINGS = {
  paperSize: 'A4',
  customWidthMm: 210,
  customHeightMm: 297,
  orientation: 'portrait',
  photosPerPage: 6,
  marginMm: 5,
  gapMm: 3,
  dpi: 300,
  outputFormat: 'pdf',
  jpgQuality: 0.92,
}

export default function App() {
  const [photos, setPhotos] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [currentPage, setCurrentPage] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState('')
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(photos.length / settings.photosPerPage))

  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(Math.max(0, totalPages - 1))
  }, [totalPages, currentPage])

  const handleFilesAdded = useCallback(async (files) => {
    setIsLoading(true)
    const newErrors = []
    const newPhotos = []

    for (const file of files) {
      try {
        const photo = await loadImageFile(file)
        newPhotos.push(photo)
      } catch (err) {
        newErrors.push(`${file.name}：${err.message}`)
      }
    }

    setPhotos(prev => [...prev, ...newPhotos])
    if (newErrors.length) setErrors(prev => [...prev, ...newErrors])
    setIsLoading(false)
  }, [])

  const handleReorder = useCallback((from, to) => {
    setPhotos(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }, [])

  const handleDelete = useCallback((id) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }, [])

  const handleRotate = useCallback((id) => {
    setPhotos(prev =>
      prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p)
    )
  }, [])

  const handleSettingChange = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleExport = useCallback(async () => {
    if (!photos.length) return
    setIsExporting(true)
    try {
      await exportFiles(photos, settings, setExportProgress)
    } catch (err) {
      setErrors(prev => [...prev, `匯出失敗：${err.message}`])
    } finally {
      setIsExporting(false)
      setExportProgress('')
    }
  }, [photos, settings])

  return (
    <div className="app">
      <header className="app-header">
        <h1>📷 照片排版列印工具</h1>
        <span className="app-badge">純前端 · 照片不上傳伺服器</span>
      </header>

      {errors.length > 0 && (
        <div className="error-bar">
          {errors.map((err, i) => (
            <div key={i} className="error-item">
              ⚠️ {err}
              <button onClick={() => setErrors(prev => prev.filter((_, j) => j !== i))} className="btn-dismiss">✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="app-body">
        <aside className="sidebar">
          <UploadZone onFilesAdded={handleFilesAdded} />

          {isLoading && <div className="loading-bar">載入中...</div>}

          {photos.length > 0 && (
            <div className="photo-stats">
              共 {photos.length} 張 · 共 {totalPages} 頁
            </div>
          )}

          {photos.length > 0 && (
            <ThumbnailList
              photos={photos}
              onReorder={handleReorder}
              onDelete={handleDelete}
              onRotate={handleRotate}
            />
          )}

          <SettingsPanel settings={settings} onSettingChange={handleSettingChange} />

          <div className="download-section">
            {settings.outputFormat === 'jpg' && (
              <div className="quality-row">
                <label>
                  JPG 品質：{Math.round(settings.jpgQuality * 100)}%
                  <input
                    type="range" min="0.6" max="1.0" step="0.01"
                    value={settings.jpgQuality}
                    onChange={e => handleSettingChange('jpgQuality', parseFloat(e.target.value))}
                  />
                </label>
              </div>
            )}
            <button
              className="btn-download"
              onClick={handleExport}
              disabled={!photos.length || isExporting}
              aria-label="下載"
            >
              {isExporting ? exportProgress || '處理中...' : '⬇ 下載'}
            </button>
          </div>

          <div className="print-links">
            <p className="print-links-title">上傳超商雲端列印</p>
            <a href="https://print.ibon.com.tw/" target="_blank" rel="noopener noreferrer">7-11 ibon 雲端列印 →</a>
            <a href="https://print.famiport.com.tw/" target="_blank" rel="noopener noreferrer">全家 FamiPort 雲端列印 →</a>
            <p className="print-links-note">兩家皆支援 A4 / B4 / A3，上傳後取得列印碼到門市機台列印。上傳前確認檔案尺寸與紙張一致，避免機台縮放跑版。</p>
          </div>
        </aside>

        <main className="preview-area">
          <PreviewPanel
            photos={photos}
            settings={settings}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  )
}
