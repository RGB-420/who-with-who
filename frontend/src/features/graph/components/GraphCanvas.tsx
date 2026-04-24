import ReactFlow, { Background, Controls } from "reactflow"
import "reactflow/dist/style.css"
import { useMemo } from "react"
import { useGraph } from "../hooks/useGraph"
import EditPersonModal from "./EditPersonModal"
import DeleteRelationModal from "./DeleteRelationalModel"
import PersonNode from "./PersonNode"

import { Plus, Link } from "lucide-react"

export default function GraphCanvas() {
  const {
    nodesWithStyle,
    edgesWithStyle,
    handleNodeClick,
    handleNodeDragStop,
    handleNodeDragStart,
    onNodesChange,
    selectedNodeId,
    isEditing,
    personName,
    setPersonName,
    closeModal,
    savePersonName,
    removePerson,
    addPerson,
    connectionMode,          // 🔥 nuevo
    setConnectionMode,       // 🔥 nuevo
    handleEdgeClick,
    selectedEdge,
    confirmDeleteRelation,
    setSelectedEdge,
    handlePaneClick
  } = useGraph()

  const getNodeName = (id: string) => {
    const node = nodesWithStyle.find(n => n.id === id)
    return node?.data?.label || id
  }

  const nodeTypes = useMemo(() => ({
    person: PersonNode
  }), [])

  return (
    <div className="w-full h-screen relative bg-white">

      <div className="fixed bottom-4 left-0 right-0 flex justify-between px-4 z-20 pointer-events-none">
        <button
          onClick={() => setConnectionMode((prev) => !prev)}
          className={`pointer-events-auto px-4 py-2 rounded-full text-white shadow-lg ${
            connectionMode ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          <Link size={50} />
        </button>

        <button
          onClick={addPerson}
          className="pointer-events-auto bg-blue-600 text-white p-3 rounded-full shadow-xl active:scale-95"
        >
          <Plus size={50} />
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
        fitView
        className="pb-24"
      >
        <Background />
        <Controls position="top-left" />
      </ReactFlow>

      {/* Modal */}
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