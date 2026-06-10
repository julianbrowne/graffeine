import { Eye } from 'lucide-react'
import Modal, { Btn } from './Modal.jsx'

export default function NodeViewModal({ node, onClose }) {
  if (!node) return null

  const entries = Object.entries(node.data ?? {})

  return (
    <Modal title="Node" icon={Eye} onClose={onClose} footer={<Btn onClick={onClose}>Close</Btn>}>
      {/* ID + Labels */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-mono text-xs text-slate-500 bg-slate-900/60 px-2 py-1 rounded">
          id: {node.id}
        </span>
        {node.labels?.map(l => (
          <span key={l} className="px-2 py-0.5 bg-cyan-900/50 text-cyan-300 rounded text-xs font-mono">
            {l}
          </span>
        ))}
      </div>

      {/* Properties */}
      {entries.length > 0 ? (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-1.5 pr-4 text-xs text-slate-500 font-medium w-1/3">Property</th>
              <th className="text-left py-1.5 text-xs text-slate-500 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([k, v]) => (
              <tr key={k} className="border-b border-slate-700/40 hover:bg-slate-700/20">
                <td className="py-2 pr-4 text-slate-400 font-mono text-xs align-top">{k}</td>
                <td className="py-2 text-slate-200 break-all">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-slate-500 italic text-sm">No properties</p>
      )}
    </Modal>
  )
}
