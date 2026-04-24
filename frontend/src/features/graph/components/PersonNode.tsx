import { Handle, Position } from "reactflow"
import { Pencil } from "lucide-react"

export default function PersonNode({ data }: any) {
  return (
    <div className="relative bg-white px-4 py-3 shadow border text-2xl cursor-grab">

      <div className="w-full h-full">
        {data.label}
      </div>

      {/* Botón editar */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          data.onEdit?.()
        }}
        className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 shadow nodrag"
      >
        <Pencil size={25} />
      </button>

      {/* Handles */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  )
}