import { PAPER_SIZES, LAYOUT_OPTIONS, DPI_OPTIONS, OUTPUT_FORMATS } from '../constants'

export default function SettingsPanel({ settings, onSettingChange }) {
  const s = settings

  return (
    <div className="settings-panel">
      <h3>設定</h3>

      <label className="setting-row">
        <span>紙張尺寸</span>
        <select value={s.paperSize} onChange={e => onSettingChange('paperSize', e.target.value)}>
          {PAPER_SIZES.map(p => (
            <option key={p.id} value={p.id}>{p.label}{p.note ? ` — ${p.note}` : ''}</option>
          ))}
        </select>
      </label>

      {s.paperSize === 'custom' && (
        <div className="setting-row custom-size">
          <span>自訂尺寸 (mm)</span>
          <div className="custom-inputs">
            <input
              type="number" min="10" max="2000"
              value={s.customWidthMm}
              onChange={e => onSettingChange('customWidthMm', parseFloat(e.target.value))}
              placeholder="寬"
            />
            <span>×</span>
            <input
              type="number" min="10" max="2000"
              value={s.customHeightMm}
              onChange={e => onSettingChange('customHeightMm', parseFloat(e.target.value))}
              placeholder="高"
            />
          </div>
        </div>
      )}

      <label className="setting-row">
        <span>方向</span>
        <div className="radio-group">
          <label>
            <input type="radio" name="orientation" value="portrait"
              checked={s.orientation === 'portrait'}
              onChange={() => onSettingChange('orientation', 'portrait')} />
            直式
          </label>
          <label>
            <input type="radio" name="orientation" value="landscape"
              checked={s.orientation === 'landscape'}
              onChange={() => onSettingChange('orientation', 'landscape')} />
            橫式
          </label>
        </div>
      </label>

      <label className="setting-row">
        <span>每頁張數</span>
        <div className="radio-group">
          {LAYOUT_OPTIONS.map(o => (
            <label key={o.value}>
              <input type="radio" name="photosPerPage" value={o.value}
                checked={s.photosPerPage === o.value}
                onChange={() => onSettingChange('photosPerPage', o.value)} />
              {o.label}
            </label>
          ))}
        </div>
      </label>

      <label className="setting-row">
        <span>頁面邊距</span>
        <div className="number-input">
          <input type="number" min="0" max="50" step="0.5"
            value={s.marginMm}
            onChange={e => onSettingChange('marginMm', parseFloat(e.target.value))} />
          <span>mm</span>
        </div>
      </label>

      <label className="setting-row">
        <span>照片間距</span>
        <div className="number-input">
          <input type="number" min="0" max="30" step="0.5"
            value={s.gapMm}
            onChange={e => onSettingChange('gapMm', parseFloat(e.target.value))} />
          <span>mm</span>
        </div>
      </label>

      <label className="setting-row">
        <span>DPI</span>
        <select value={s.dpi} onChange={e => onSettingChange('dpi', parseInt(e.target.value))}>
          {DPI_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label className="setting-row">
        <span>輸出格式</span>
        <select value={s.outputFormat} onChange={e => onSettingChange('outputFormat', e.target.value)}>
          {OUTPUT_FORMATS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
