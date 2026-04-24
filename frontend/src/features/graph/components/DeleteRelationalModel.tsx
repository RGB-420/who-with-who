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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <h2 className="text-lg font-semibold mb-4">
          Eliminar relación
        </h2>

        <p className="mb-6">
          ¿Quieres eliminar la relación entre{" "}
          <strong>{sourceName}</strong> y{" "}
          <strong>{targetName}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded-lg bg-red-600 text-white"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}