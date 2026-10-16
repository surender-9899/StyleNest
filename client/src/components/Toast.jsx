export default function Toast({ message, type='info', onClose }) {
  if (!message) return null
  return <div role="status" className={`fixed bottom-5 right-5 z-[100] max-w-sm rounded-xl border bg-white px-4 py-3 text-sm shadow-soft ${type==='error'?'border-red-200 text-red-700':'border-neutral-200 text-ink'}`}><div className="flex items-center gap-3"><span>{message}</span><button className="font-bold text-neutral-400 hover:text-ink" onClick={onClose}>×</button></div></div>
}
