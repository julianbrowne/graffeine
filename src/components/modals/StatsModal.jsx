import { BarChart3 } from 'lucide-react'
import Modal, { Btn } from './Modal.jsx'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-slate-900/60 rounded-xl p-4 text-center">
      <div className="text-3xl font-bold text-white tabular-nums">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function StatsModal({ nodes, links, pathTypes, onClose }) {
  const labelCounts = {}
  nodes.forEach(n => (n.labels ?? []).forEach(l => { labelCounts[l] = (labelCounts[l] ?? 0) + 1 }))
  const sortedLabels = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])

  const typeCounts = {}
  links.forEach(l => { typeCounts[l.type] = (typeCounts[l.type] ?? 0) + 1 })
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])

  return (
    <Modal title="Graph Statistics" icon={BarChart3} onClose={onClose} wide
           footer={<Btn onClick={onClose}>Close</Btn>}>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Nodes" value={nodes.length} />
        <StatCard label="Relationships" value={links.length} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Node Labels
          </h3>
          {sortedLabels.length ? (
            <div className="space-y-1.5">
              {sortedLabels.map(([label, count]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex-1 h-5 bg-slate-900/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-600/70 rounded-full"
                      style={{ width: `${Math.round((count / nodes.length) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-mono w-24 truncate">{label}</span>
                  <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 italic text-xs">None</p>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Relationship Types
          </h3>
          {sortedTypes.length ? (
            <div className="space-y-1.5">
              {sortedTypes.map(([type, count]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="flex-1 h-5 bg-slate-900/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600/70 rounded-full"
                      style={{ width: `${Math.round((count / links.length) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-300 font-mono w-24 truncate">{type}</span>
                  <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 italic text-xs">None</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
