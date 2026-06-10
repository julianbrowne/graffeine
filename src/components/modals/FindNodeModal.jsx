import { useState } from 'react'
import { Search } from 'lucide-react'
import Modal, { Btn, Field, inputCls } from './Modal.jsx'

export default function FindNodeModal({ onFind, onClose }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')

  const handleFind = () => {
    onFind(name.trim() || undefined, type.trim() || undefined)
    onClose()
  }

  return (
    <Modal
      title="Find Nodes"
      icon={Search}
      onClose={onClose}
      footer={
        <>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleFind} disabled={!name.trim() && !type.trim()}>
            Find
          </Btn>
        </>
      }
    >
      <p className="text-sm text-slate-400 mb-4">
        Search for nodes matching a name or type. Results are added to the current graph view.
      </p>

      <Field label="Name">
        <input
          className={inputCls}
          placeholder="e.g. Alice"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFind()}
          autoFocus
        />
      </Field>

      <Field label="Type / Label">
        <input
          className={inputCls}
          placeholder="e.g. Person"
          value={type}
          onChange={e => setType(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFind()}
        />
      </Field>
    </Modal>
  )
}
