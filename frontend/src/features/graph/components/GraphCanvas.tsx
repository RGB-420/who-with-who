import ReactFlow, { Background, type ReactFlowInstance } from "reactflow"
import "reactflow/dist/style.css"
import { useMemo, useState } from "react"
import { ChartNoAxesColumn, Link, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react"
import { useGraph } from "../hooks/useGraph"
import EditPersonModal from "./EditPersonModal"
import DeleteRelationModal from "./DeleteRelationalModel"
import PersonNode from "./PersonNode"

const BRAND_LOGO_SRC = "/brand-logo.png"

export default function GraphCanvas() {
  const {
    nodesWithStyle,
    edgesWithStyle,
    handleNodeClick,
    handleNodeDragStop,
    handleNodeDragStart,
    onNodesChange,
    selectedNodeId,
    isLoading,
    isEditing,
    personName,
    setPersonName,
    closeModal,
    savePersonName,
    removePerson,
    openPersonEditor,
    addPerson,
    connectionMode,
    setConnectionMode,
    handleEdgeClick,
    selectedEdge,
    confirmDeleteRelation,
    setSelectedEdge,
    handlePaneClick,
    selectNode
  } = useGraph()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null)

  const getNodeName = (id: string) => {
    const node = nodesWithStyle.find((n) => n.id === id)
    return node?.data?.label || id
  }

  const nodeTypes = useMemo(() => ({
    person: PersonNode
  }), [])

  const selectedNode = selectedNodeId
    ? nodesWithStyle.find((node) => node.id === selectedNodeId)
    : null
  const selectedNodeName = selectedNode?.data?.label?.trim() || "Sin nombre"

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const searchResults = useMemo(() => {
    if (!normalizedSearch) return nodesWithStyle

    return nodesWithStyle.filter((node) =>
      String(node.data?.label ?? "")
        .toLowerCase()
        .includes(normalizedSearch)
    )
  }, [nodesWithStyle, normalizedSearch])

  const handleSearchResultClick = (id: string) => {
    const node = nodesWithStyle.find((item) => item.id === id)

    selectNode(id)
    setIsSearchOpen(false)
    setSearchTerm("")

    if (node && flowInstance) {
      void flowInstance.setCenter(
        node.position.x + 60,
        node.position.y + 20,
        {
          duration: 600,
          zoom: 1.4
        }
      )
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f6f3ee] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_34%),linear-gradient(135deg,rgba(34,197,94,0.08),transparent_28%),linear-gradient(315deg,rgba(59,130,246,0.10),transparent_32%)]" />

      <header className="absolute left-0 right-0 top-0 z-40 box-border flex w-full flex-col gap-2 p-3 md:left-6 md:right-6 md:top-6 md:w-auto md:flex-row md:items-start md:justify-between md:p-0">
        <div className="w-full rounded-lg border border-white/70 bg-white/90 px-3 py-3 shadow-lg shadow-slate-900/10 backdrop-blur md:w-auto md:min-w-64">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                <img
                  src={BRAND_LOGO_SRC}
                  alt="Comi Lios"
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <h1 className="truncate text-lg font-bold leading-tight tracking-normal">Comi Lios</h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                aria-label="Ver estadisticas"
                onClick={() => setIsStatsOpen((prev) => !prev)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition active:scale-95 ${
                  isStatsOpen
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                type="button"
              >
                <ChartNoAxesColumn size={19} />
              </button>

              <button
                aria-label="Buscar personas"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition active:scale-95 ${
                  isSearchOpen
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                type="button"
              >
                <Search size={19} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isStatsOpen && (
        <div className="absolute left-3 right-3 top-[5.75rem] z-50 md:left-6 md:right-auto md:top-24 md:w-80">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/70 bg-white/95 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur">
            <div className="rounded-md bg-slate-100 px-3 py-2">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Users size={16} />
                <span>Personas</span>
              </div>
              <p className="text-xl font-bold leading-none text-slate-950">{nodesWithStyle.length}</p>
            </div>
            <div className="rounded-md bg-slate-100 px-3 py-2">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Link size={16} />
                <span>Relaciones</span>
              </div>
              <p className="text-xl font-bold leading-none text-slate-950">{edgesWithStyle.length}</p>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="absolute left-3 right-3 top-[5.75rem] z-50 md:left-6 md:right-auto md:top-24 md:w-80">
          <div className="overflow-hidden rounded-lg border border-white/70 bg-white/95 shadow-2xl shadow-slate-900/15 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar persona..."
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
              />
              <button
                aria-label="Cerrar busqueda"
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchTerm("")
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                type="button"
              >
                <X size={17} />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {searchResults.length > 0 ? (
                searchResults.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleSearchResultClick(node.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition hover:bg-slate-100"
                    type="button"
                  >
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {node.data?.label?.trim() || "Sin nombre"}
                    </span>
                    <span className="text-xs font-medium text-slate-400">Ver</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-slate-500">
                  No hay personas con ese nombre.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedNode && !connectionMode && !isEditing && (
        <div className="absolute bottom-20 left-3 right-3 z-50 md:bottom-24 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2">
          <div className="rounded-lg border border-white/70 bg-white/95 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-950">{selectedNodeName}</p>
              </div>
              <button
                aria-label="Cerrar panel de persona"
                onClick={handlePaneClick}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                type="button"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openPersonEditor(selectedNode.id, selectedNodeName)}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 active:scale-95"
                type="button"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={async () => {
                  await removePerson(selectedNode.id)
                  handlePaneClick()
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-rose-50 px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95"
                type="button"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 flex w-full items-center justify-between gap-3 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:bottom-6 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 md:p-0">
        <button
          aria-label={connectionMode ? "Salir del modo conectar" : "Conectar personas"}
          onClick={() => setConnectionMode((prev) => !prev)}
          className={`pointer-events-auto flex h-12 min-w-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-xl shadow-slate-900/20 transition active:scale-95 ${
            connectionMode
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-white text-slate-800 hover:bg-slate-100"
          }`}
        >
          <Link size={20} />
          <span className="hidden sm:inline">{connectionMode ? "Conectando" : "Conectar"}</span>
        </button>

        <button
          aria-label="Anadir persona"
          onClick={addPerson}
          className="pointer-events-auto flex h-12 min-w-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 active:scale-95"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Persona</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodesWithStyle}
        edges={edgesWithStyle}
        onNodesChange={onNodesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        nodesDraggable
        onInit={setFlowInstance}
        fitView
        className="relative z-10 h-full w-full"
      >
        <Background color="#d8d3ca" gap={22} size={1.5} />
      </ReactFlow>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center bg-[#f6f3ee]/55 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-lg border border-white/70 bg-white/95 px-4 py-3 shadow-2xl shadow-slate-900/15">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
            <span className="text-sm font-semibold text-slate-700">Cargando datos...</span>
          </div>
        </div>
      )}

      {isEditing && (
        <EditPersonModal
          personName={personName}
          setPersonName={setPersonName}
          onClose={closeModal}
          onSave={savePersonName}
          onDelete={() => {
            if (selectedNodeId) {
              removePerson(selectedNodeId)
              closeModal()
            }
          }}
        />
      )}

      {selectedEdge && (
        <DeleteRelationModal
          sourceName={getNodeName(selectedEdge.source)}
          targetName={getNodeName(selectedEdge.target)}
          onClose={() => setSelectedEdge(null)}
          onConfirm={confirmDeleteRelation}
        />
      )}
    </div>
  )
}
