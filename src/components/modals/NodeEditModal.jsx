import { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import Modal, { Btn, Field, inputCls } from './Modal.jsx'

export default function NodeEditModal({ node, onSave, onClose }) {
  const isNew = !node

  const [labels, setLabels] = useState(node?.labels?.join(', ') ?? '')
  const [props, setProps] = useState(() =>
    node?.data
      ? Object.entries(node.data).map(([k, v]) => ({ k, v: String(v) }))
      : [{ k: '', v: '' }]
  )

  const setProp = (i, field, val) =>
    setProps(prev => prev.map((p, j) => j === i ? { ...p, [field]: val } : p))

  const addProp = () => setProps(prev => [...prev, { k: '', v: '' }])

  const removeProp = (i) => setProps(prev => prev.filter((_, j) => j !== i))

  const handleSave = () => {
    const data = {}
    props.forEach(({ k, v }) => { if (k.trim()) data[k.trim()] = v })
    const labelArr = labels.split(',').map(l => l.trim()).filter(Boolean)
    onSave({ data, labels: labelArr })
  }

  return (
    <Modal
      title={isNew ? 'New Node' : 'Edit Node'}
      icon={Pencil}
      onClose={onClose}
      footer={
        <>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave}>Save</Btn>
        </>
      }
    >
      {!isNew && (
        <div className="mb-4 text-xs text-slate-500 font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg">
          id: {node.id}
        </div>
      )}

      <Field label="Labels (comma-separated)">
        <input
          className={inputCls}
          placeholder="Person, Employee"
          value={labels}
          onChange={e => setLabels(e.target.value)}
        />
      </Field>

      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Properties</span>
        <button
          onClick={addProp}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Plus size={12} /> Add field
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {props.map((p, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className={`${inputCls} flex-1`}
              placeholder="key"
              value={p.k}
              onChange={e => setProp(i, 'k', e.target.value)}
            />
            <input
              className={`${inputCls} flex-[2]`}
              placeholder="value"
              value={p.v}
              onChange={e => setProp(i, 'v', e.target.value)}
            />
            <button
              onClick={() => removeProp(i)}
              className="text-slate-600 hover:text-rose-400 transition-colors p-1"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </Modal>
  )
}
