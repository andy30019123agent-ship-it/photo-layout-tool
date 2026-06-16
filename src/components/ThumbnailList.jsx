import { useRef, useState } from 'react'

export default function ThumbnailList({ photos, onReorder, onDelete, onRotate }) {
  const dragIndexRef = useRef(null)
  const [draggingId, setDraggingId] = useState(null)

  function startDrag(e, i) {
    dragIndexRef.current = i
    setDraggingId(photos[i].id)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function moveDrag(e) {
    if (dragIndexRef.current === null) return
    e.preventDefault()
    const target = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest('.thumbnail-item')
    if (!target) return
    const over = Number(target.dataset.index)
    if (!Number.isNaN(over) && over !== dragIndexRef.current) {
      onReorder(dragIndexRef.current, over)
      dragIndexRef.current = over
    }
  }

  function endDrag() {
    dragIndexRef.current = null
    setDraggingId(null)
  }

  return (
    <div className="thumbnail-list">
      <div className="thumbnail-grid">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={`thumbnail-item ${draggingId === photo.id ? 'dragging' : ''}`}
            data-index={i}
            title={photo.name}
          >
            <div
              className="thumbnail-img-wrap"
              style={{ transform: `rotate(${photo.rotation}deg)` }}
            >
              <img src={photo.dataUrl} alt={photo.name} draggable={false} />
            </div>
            <div className="thumbnail-actions">
              <button
                onClick={() => onRotate(photo.id)}
                title="旋轉 90°"
                aria-label="旋轉"
                className="btn-icon"
              >↻</button>
              <button
                onClick={() => onDelete(photo.id)}
                title="刪除"
                aria-label="刪除"
                className="btn-icon btn-delete"
              >✕</button>
            </div>
            <span className="thumbnail-index">{i + 1}</span>
            <button
              className="thumbnail-drag-handle"
              aria-label="拖曳調整順序"
              title="按住拖曳調整順序"
              onPointerDown={e => startDrag(e, i)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >⠿</button>
          </div>
        ))}
      </div>
      <p className="thumbnail-hint">按住 ⠿ 拖曳可調整列印順序</p>
    </div>
  )
}
