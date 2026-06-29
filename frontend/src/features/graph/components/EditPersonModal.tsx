import { Trash2, X, LucideSave } from "lucide-react"

type Props = {
  personName: string
  setPersonName: (name: string) => void
  onClose: () => void
  onSave: () => void
  onDelete: () => void
}

export default function EditPersonModal({
  personName,
  setPersonName,
  onClose,
  onSave,
  onDelete
}: Props) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-lg border border-white/80 bg-white p-5 shadow-2xl shadow-slate-950/25">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Editar persona</h2>
          </div>
          <button
            aria-label="Cerrar modal"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <input
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Nombre..."
          autoFocus
          className="mb-5 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onDelete}
            className="flex min-h-10 items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <Trash2 size={20} />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="min-h-10 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
            >
            <LucideSave size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
