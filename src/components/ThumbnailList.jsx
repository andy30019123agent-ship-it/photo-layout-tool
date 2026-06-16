import { useRef } from 'react'

export default function ThumbnailList({ photos, onReorder, onDelete, onRotate }) {
  const dragIndexRef = useRef(null)

  function onDragStart(i) {
    dragIndexRef.current = i
  }

  function onDragOver(e, i) {
    e.preventDefault()
    if (dragIndexRef.current !== null && dragIndexRef.current !== i) {
      onReorder(dragIndexRef.current, i)
      dragIndexRef.current = i
    }
  }

  function onDragEnd() {
    dragIndexRef.current = null
  }

  return (
    <div className="thumbnail-list">
      <div className="thumbnail-grid">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="thumbnail-item"
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => onDragOver(e, i)}
            onDragEnd={onDragEnd}
            title={photo.name}
          >
            <div
              className="thumbnail-img-wrap"
              style={{ transform: `rotate(${photo.rotation}deg)` }}
            >
              <img src={photo.dataUrl} alt={photo.name} />
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
          </div>
        ))}
      </div>
    </div>
  )
}
