const CATEGORY_STYLES = {
  info:    'text-cyan-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error:   'text-rose-400',
}

export default function StatusBar({ connected, messages, nodeCount, linkCount }) {
  const latest = messages[messages.length - 1]

  return (
    <footer className="flex items-center gap-4 px-4 h-7 bg-slate-900/80 border-t border-slate-700/40
                       text-xs text-slate-500 shrink-0">
      <span className={`flex items-center gap-1.5 font-medium
                        ${connected ? 'text-emerald-500' : 'text-rose-500'}`}>
        <span className={`w-1.5 h-1.5 rounded-full inline-block
                          ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        {connected ? 'neo4j' : 'offline'}
      </span>

      <span className="w-px h-3 bg-slate-700" />

      {latest ? (
        <span className={`truncate ${CATEGORY_STYLES[latest.category] ?? 'text-slate-400'}`}>
          {latest.title && <strong className="mr-1">{latest.title}:</strong>}
          {latest.message}
        </span>
      ) : (
        <span className="italic">Ready</span>
      )}

      <div className="flex-1" />

      <span>{nodeCount} nodes · {linkCount} relationships</span>
    </footer>
  )
}
