import type { NodeProps } from "reactflow"
import { Handle, Position } from "reactflow"
import { Pencil } from "lucide-react"
import type { PersonNodeData } from "../utils/graph.utils"

export default function PersonNode({ data }: NodeProps<PersonNodeData>) {
  const displayName = data.label?.trim() || "Sin nombre"

  return (
    <div className="group relative min-w-24 max-w-40 cursor-grab rounded-md border border-white/80 bg-white px-3 py-2 shadow-md shadow-slate-900/10 transition hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing">
      <div className="truncate text-center text-sm font-bold leading-tight text-slate-950">
        {displayName}
      </div>

      <button
        aria-label={`Editar ${displayName}`}
        onClick={(e) => {
          e.stopPropagation()
          data.onEdit?.()
        }}
        className="nodrag absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-md bg-slate-950 text-white opacity-0 shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 group-hover:opacity-100"
      >
        <Pencil size={12} />
      </button>

      <Handle className="!h-2.5 !w-2.5 !border-2 !border-white !bg-pink-500" type="source" position={Position.Right} />
      <Handle className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-950" type="target" position={Position.Left} />
    </div>
  )
}
