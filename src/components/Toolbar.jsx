import { useState, useEffect, useRef } from 'react'
import {
  RefreshCw, Trash2, BarChart3, BookOpen, FolderOpen,
  Plus, Search, Network, ChevronDown, Hexagon,
} from 'lucide-react'

function Dropdown({ label, icon: Icon, items, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
                   text-slate-300 hover:text-white hover:bg-slate-700
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {Icon && <Icon size={14} />}
        {label}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-44
                        bg-slate-800 border border-slate-600 rounded-lg shadow-2xl py-1
                        animate-in fade-in slide-in-from-top-1 duration-100">
          {items.map((item, i) =>
            item === '---'
              ? <div key={i} className="my-1 border-t border-slate-700" />
              : (
                <button
                  key={i}
                  onClick={() => { item.action(); setOpen(false) }}
                  disabled={item.disabled}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300
                             hover:bg-slate-700 hover:text-white
                             disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {item.icon && <item.icon size={13} className="text-slate-400" />}
                  {item.label}
                </button>
              )
          )}
        </div>
      )}
    </div>
  )
}

export default function Toolbar({
  connected, gists, nodeCount, linkCount,
  onRefresh, onClear, onLoadGist, onOrphans, onStats,
  onNewNode, onFindNode,
}) {
  const graphItems = [
    { label: 'Refresh', icon: RefreshCw, action: onRefresh },
    '---',
    ...(gists.length
      ? gists.map(name => ({
          label: name,
          icon: FolderOpen,
          action: () => onLoadGist(name),
        }))
      : [{ label: 'No gists found', icon: BookOpen, action: () => {}, disabled: true }]
    ),
    '---',
    { label: 'Statistics', icon: BarChart3, action: onStats },
    '---',
    { label: 'Clear graph', icon: Trash2, action: onClear },
  ]

  const nodeItems = [
    { label: 'New node',     icon: Plus,    action: onNewNode },
    { label: 'Find node',    icon: Search,  action: onFindNode },
    { label: 'Show orphans', icon: Network, action: onOrphans },
  ]

  return (
    <header className="flex items-center gap-2 px-4 h-12 bg-slate-900 border-b border-slate-700/60 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-3">
        <Hexagon size={20} className="text-cyan-400 fill-cyan-400/20" strokeWidth={1.5} />
        <span className="text-sm font-semibold tracking-wide text-white">Graffeine</span>
      </div>

      <div className="w-px h-5 bg-slate-700" />

      <Dropdown label="Graph" disabled={!connected} items={graphItems} />
      <Dropdown label="Node"  disabled={!connected} items={nodeItems}  />

      <div className="flex-1" />

      {/* Stats pills */}
      {connected && (
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{nodeCount} <span className="text-slate-600">nodes</span></span>
          <span>{linkCount} <span className="text-slate-600">rels</span></span>
        </div>
      )}

      {/* Connection status */}
      <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
                      ${connected
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-rose-400'}`}
              style={connected ? { boxShadow: '0 0 6px #4ade80' } : {}} />
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </header>
  )
}
