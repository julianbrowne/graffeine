import { useEffect, useRef } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export default function NodeContextMenu({ node, x, y, onView, onEdit, onDelete, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const items = [
    { label: 'View',   icon: Eye,    action: onView,   cls: 'text-slate-300' },
    { label: 'Edit',   icon: Pencil, action: onEdit,   cls: 'text-cyan-400' },
    { label: 'Delete', icon: Trash2, action: onDelete, cls: 'text-rose-400' },
  ]

  const title = node?.data?.name
    ?? node?.labels?.[0]
    ?? `#${node?.id}`

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl py-1 min-w-40"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-1.5 text-xs text-slate-500 border-b border-slate-700 mb-1 font-mono truncate">
        {title}
      </div>
      {items.map(({ label, icon: Icon, action, cls }) => (
        <button
          key={label}
          onClick={action}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-700 transition-colors ${cls}`}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  )
}
