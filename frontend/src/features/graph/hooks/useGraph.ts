import { useState, useRef, useCallback, useEffect } from "react"
import type { Node, Edge, NodeMouseHandler } from "reactflow"
import { applyNodeChanges, type NodeChange } from "reactflow"

import {
  fetchPersons,
  fetchRelations,
  createPerson,
  createRelation,
  updatePersonPosition,
  updatePersonName,
  deletePerson,
  deleteRelation
} from "../api/graphApi"

import {
  mapPersonsToNodes,
  mapRelationsToEdges
} from "../utils/graph.utils"

export function useGraph() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [personName, setPersonName] = useState("")

  const previousPositions = useRef<Record<string, { x: number; y: number }>>({})
  const [isEditing, setIsEditing] = useState(false)

    const handleEditNode = (id: string, name: string) => {
      setSelectedNodeId(id)
      setPersonName(name)
      setIsEditing(true) // 🔥 SOLO aquí abrimos modal
    }

    const loadGraph = async () => {
      const persons = await fetchPersons()
      const relations = await fetchRelations()

      setNodes(mapPersonsToNodes(persons, handleEditNode))
      setEdges(mapRelationsToEdges(relations))
    }

  useEffect(() => {
    loadGraph()
  }, [])


  const closeModal = () => {
    setIsEditing(false)
    setSelectedNodeId(null)
    setPersonName("")
  }

  // 🔄 Movimiento nodos (estado local)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    []
  )

  const savePersonName = async () => {
    if (!selectedNodeId) return
    if (personName.trim() === "") return

    try {
      await updatePersonName(selectedNodeId, personName)

      await loadGraph() // 🔥 sincroniza con backend
    } catch (error) {
      console.error("Error updating name", error)
    }

    closeModal()
  }

  const addPerson = async () => {
    const x = Math.random() * 400
    const y = Math.random() * 400

    const newPerson = await createPerson("", x, y)

    const id = String(newPerson.id)

    // 🔥 añadir nodo
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "person",
        data: {
          label: newPerson.name,
          onEdit: () => handleEditNode(id, newPerson.name)
        },
        position: { x, y }
      }
    ])

    // 🔥 abrir modal automáticamente
    setSelectedNodeId(id)
    setPersonName(newPerson.name)
    setIsEditing(true)
  }

  const removePerson = async (id: string) => {
    await deletePerson(id)
    await loadGraph()
  }

  // 🔗 Crear relación (API)
  const connectNodes = async (source: string, target: string) => {
    if (source === target) return

    try {
      await createRelation(Number(source), Number(target), "")
      await loadGraph()
    } catch (error) {
      console.error("Error creating relation", error)
    }
  }

  const handleNodeDragStart = (_: any, node: Node | undefined) => {
    if (!node || !node.id) return

    previousPositions.current[node.id] = {
      x: node.position.x,
      y: node.position.y
    }
  }

  // 📍 Guardar posición en backend + rollback
  const handleNodeDragStop = async (_: any, node: Node) => {
    try {
      await updatePersonPosition(
        node.id,
        node.position.x,
        node.position.y
      )
    } catch (error) {
      console.error("Error updating position", error)

      const prev = previousPositions.current[node.id]

      if (prev) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, position: prev }
              : n
          )
        )
      }
    }
  }
  const [selectedForConnection, setSelectedForConnection] = useState<string | null>(null)
  const [connectionMode, setConnectionMode] = useState(false)
  
  const handleNodeClick: NodeMouseHandler = useCallback(async (_, node) => {
    const clickedId = node.id

    // 🟢 MODO CONEXIÓN
    if (connectionMode) {
      if (!selectedForConnection) {
        setSelectedForConnection(clickedId)
        return
      }

      if (selectedForConnection === clickedId) {
        setSelectedForConnection(null)
        return
      }

      await connectNodes(selectedForConnection, clickedId)
      setSelectedForConnection(null)
      return // 🔥 IMPORTANTE: salir aquí
    }

    // 🟢 MODO NORMAL
    setSelectedNodeId(clickedId)
  }, [connectionMode, selectedForConnection, connectNodes])

  const removeRelation = async (id: string) => {
    try {
      await deleteRelation(id)
      await loadGraph()
    } catch (error) {
      console.error("Error deleting relation", error)
    }
  }

  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)

  const handleEdgeClick = (_: any, edge: Edge) => {
    setSelectedEdge(edge)
  }

  const confirmDeleteRelation = async () => {
    if (!selectedEdge) return

    await deleteRelation(selectedEdge.id)
    await loadGraph()

    setSelectedEdge(null)
  }

  const connectedNodeIds = new Set<string>()

  edges.forEach((edge) => {
    if (edge.source === selectedNodeId) {
      connectedNodeIds.add(edge.target)
    }
    if (edge.target === selectedNodeId) {
      connectedNodeIds.add(edge.source)
    }
  })

  const nodesWithStyle = nodes.map((node) => {
    const isSelected = node.id === selectedNodeId
    const isConnected = connectedNodeIds.has(node.id)

    return {
      ...node,
      data: node.data,
      style: selectedForConnection === node.id
        ? {
            border: "2px solid #22c55e",
            boxShadow: "0 0 10px rgba(34,197,94,0.7)"
          }
        : isSelected
        ? {
            border: "2px solid #3b82f6",
            boxShadow: "0 0 10px rgba(59,130,246,0.6)"
          }
        : selectedNodeId
        ? isConnected
          ? {
              border: "2px solid #60a5fa",
              opacity: 1
            }
          : {
              opacity: 0.2
            }
        : {}
    }
  })

  const handlePaneClick = () => {
    setSelectedNodeId(null)
    setSelectedForConnection(null)
    setSelectedEdge(null)
  }

  const edgesWithStyle = edges.map((edge) => {
  const isConnected =
    edge.source === selectedNodeId || edge.target === selectedNodeId

  return {
    ...edge,
    style: selectedNodeId
      ? isConnected
        ? {
            stroke: "#3b82f6",
            strokeWidth: 3
          }
        : {
            opacity: 0.1
          }
      : {}
  }
})

  return {
    nodesWithStyle,
    edgesWithStyle,
    handleNodeClick,
    handleNodeDragStart,
    handleNodeDragStop,
    onNodesChange,
    selectedNodeId,
    isEditing,
    personName,
    setPersonName,
    closeModal,
    savePersonName,
    addPerson,
    removePerson,
    connectNodes,
    connectionMode,          // 🔥 nuevo
    setConnectionMode,       // 🔥 nuevo
    selectedForConnection ,
    removeRelation,
    handleEdgeClick,
    selectedEdge,
    confirmDeleteRelation,
    setSelectedEdge,
    handlePaneClick
  }
}