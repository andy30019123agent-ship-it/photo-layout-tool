import { useEffect, useRef } from 'react'
import { renderPage } from '../utils/canvasEngine'

const PREVIEW_WIDTH = 560

export default function PreviewPanel({ photos, settings, currentPage, totalPages, onPageChange }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    renderPage(canvas, photos, settings, currentPage, PREVIEW_WIDTH)
  }, [photos, settings, currentPage])

  return (
    <div className="preview-panel">
      <div className="preview-canvas-wrap">
        <canvas ref={canvasRef} className="preview-canvas" />
        {photos.length === 0 && (
          <div className="preview-placeholder">
            <p>上傳照片後顯示預覽</p>
          </div>
        )}
      </div>

      <div className="preview-nav">
        <button
          onClick={() => onPageChange(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          aria-label="上一頁"
          className="btn-nav"
        >◀</button>
        <span className="page-indicator">
          第 {currentPage + 1} / {totalPages} 頁
        </span>
        <button
          onClick={() => onPageChange(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage >= totalPages - 1}
          aria-label="下一頁"
          className="btn-nav"
        >▶</button>
      </div>
    </div>
  )
}
