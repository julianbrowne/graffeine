import { useState } from 'react'
import { Link } from 'lucide-react'
import Modal, { Btn, Field, inputCls } from './Modal.jsx'

function nodeLabel(node) {
  if (!node) return '?'
  return node.data?.name ?? node.labels?.[0] ?? `#${node.id}`
}

export default function PathEditModal({ source, target, pathTypes, onSave, onClose }) {
  const [relType, setRelType] = useState('')

  const handleSave = () => {
    const name = relType.trim().toUpperCase().replace(/\s+/g, '_')
    if (name) onSave(name)
  }

  return (
    <Modal
      title="Create Relationship"
      icon={Link}
      onClose={onClose}
      footer={
        <>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave} disabled={!relType.trim()}>Create</Btn>
        </>
      }
    >
      <div className="flex items-center gap-3 mb-5 p-3 bg-slate-900/60 rounded-lg text-sm">
        <span className="px-2.5 py-1 bg-slate-700 rounded-lg text-slate-200 font-mono text-xs truncate max-w-32">
          {nodeLabel(source)}
        </span>
        <span className="text-slate-500 text-xs">→</span>
        <span className="px-2.5 py-1 bg-slate-700 rounded-lg text-slate-200 font-mono text-xs truncate max-w-32">
          {nodeLabel(target)}
        </span>
      </div>

      <Field label="Relationship type">
        <input
          className={inputCls}
          placeholder="e.g. KNOWS, WORKS_AT, MANAGES"
          value={relType}
          onChange={e => setRelType(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
          list="rel-types"
        />
        {pathTypes?.length > 0 && (
          <datalist id="rel-types">
            {pathTypes.map(t => <option key={t} value={t} />)}
          </datalist>
        )}
      </Field>

      {pathTypes?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-slate-500 mb-2">Existing types:</p>
          <div className="flex flex-wrap gap-1.5">
            {pathTypes.map(t => (
              <button
                key={t}
                onClick={() => setRelType(t)}
                className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-mono transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
