import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, icon: Icon, children, onClose, footer, wide }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative flex flex-col bg-slate-800 border border-slate-600/80 rounded-xl
                    shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2.5 text-white font-semibold">
            {Icon && <Icon size={16} className="text-cyan-400" />}
            {title}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors rounded-md p-0.5 hover:bg-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function Btn({ children, onClick, variant = 'default', type = 'button', disabled }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    default:  'bg-slate-700 text-slate-200 hover:bg-slate-600',
    primary:  'bg-cyan-600 text-white hover:bg-cyan-500',
    danger:   'bg-rose-700 text-white hover:bg-rose-600',
    ghost:    'text-slate-400 hover:text-white hover:bg-slate-700',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}

export function Field({ label, children }) {
  return (
    <div className="mb-3">
      {label && <label className="block text-xs text-slate-400 mb-1 font-medium">{label}</label>}
      {children}
    </div>
  )
}

export const inputCls = `w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2
  text-sm text-slate-100 placeholder-slate-600
  focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40
  transition-colors`
