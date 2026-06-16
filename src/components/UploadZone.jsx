import { useRef, useState } from 'react'
import { ACCEPTED_EXTS } from '../constants'

export default function UploadZone({ onFilesAdded }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(files) {
    const valid = Array.from(files).filter(f => {
      const ext = '.' + f.name.split('.').pop().toLowerCase()
      return ACCEPTED_EXTS.includes(ext) || f.type.startsWith('image/')
    })
    if (valid.length > 0) onFilesAdded(valid)
  }

  function onDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function onDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave() {
    setIsDragging(false)
  }

  return (
    <div
      className={`upload-zone ${isDragging ? 'dragging' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="上傳照片"
    >
      <div className="upload-icon">📁</div>
      <p className="upload-text">點擊或拖曳上傳照片</p>
      <p className="upload-hint">支援 JPG、PNG、WebP、HEIC・可一次選多張</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTS.join(',')}
        multiple
        onChange={e => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
    </div>
  )
}
