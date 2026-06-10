export default function NodeTooltip({ node, x, y }) {
  if (!node) return null

  const entries = Object.entries(node.data ?? {}).slice(0, 6)

  return (
    <div
      className="fixed z-40 pointer-events-none bg-slate-800/95 border border-slate-600
                 rounded-lg shadow-2xl p-3 max-w-56 text-xs backdrop-blur-sm"
      style={{ left: x + 14, top: y - 10 }}
    >
      {/* Labels */}
      {node.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {node.labels.map(l => (
            <span key={l} className="px-1.5 py-0.5 bg-cyan-900/60 text-cyan-300 rounded text-[10px] font-mono">
              {l}
            </span>
          ))}
        </div>
      )}

      {/* Properties */}
      {entries.length > 0 ? (
        <table className="w-full">
          <tbody>
            {entries.map(([k, v]) => (
              <tr key={k}>
                <td className="pr-2 text-slate-500 font-mono align-top">{k}</td>
                <td className="text-slate-200 break-all">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span className="text-slate-500 italic">No properties</span>
      )}

      <div className="mt-2 pt-2 border-t border-slate-700 text-slate-600 font-mono">
        id: {node.id}
      </div>
    </div>
  )
}
