import { Link2Off, X, Trash2 } from "lucide-react"

type Props = {
  sourceName: string
  targetName: string
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteRelationModal({
  sourceName,
  targetName,
  onClose,
  onConfirm
}: Props) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-white/80 bg-white p-5 shadow-2xl shadow-slate-950/25">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <Link2Off size={19} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Eliminar relacion</h2>
            </div>
          </div>
          <button
            aria-label="Cerrar modal"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-6 rounded-lg bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          Quieres eliminar la relacion entre{" "}
          <strong>{sourceName}</strong> y{" "}
          <strong>{targetName}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onConfirm}
            className="min-h-10 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-900/15 transition hover:bg-rose-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
