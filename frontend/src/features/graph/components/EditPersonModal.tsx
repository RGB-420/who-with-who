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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
        <h2 className="text-lg font-semibold mb-4">Editar persona</h2>

        <input
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Nombre..."
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onDelete}
            className="px-3 py-1 rounded-lg bg-red-600 text-white"
          >
            Eliminar
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="px-3 py-1 rounded-lg bg-blue-600 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}