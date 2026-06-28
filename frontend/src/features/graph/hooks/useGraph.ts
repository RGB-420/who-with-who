import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import type { Edge, Node, NodeMouseHandler } from "reactflow"
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
  mapPersonToNode,
  mapPersonsToNodes,
  mapRelationToEdge,
  mapRelationsToEdges,
  type Person,
  type PersonNodeData,
  type Relation
} from "../utils/graph.utils"

type NodePosition = {
  x: number
  y: number
}

const TEMP_NODE_PREFIX = "temp-person-"

function isTempPersonId(id: string) {
  return id.startsWith(TEMP_NODE_PREFIX)
}

export function useGraph() {
  const [nodes, setNodes] = useState<Node<PersonNodeData>[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [personName, setPersonName] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedForConnection, setSelectedForConnection] = useState<string | null>(null)
  const [connectionMode, setConnectionMode] = useState(false)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)

  const previousPositions = useRef<Record<string, NodePosition>>({})

  const handleEditNode = useCallback((id: string, name: string) => {
    setSelectedNodeId(id)
    setPersonName(name)
    setIsEditing(true)
  }, [])

  const loadGraph = useCallback(async () => {
    try {
      setIsLoading(true)

      const persons = await fetchPersons() as Person[]
      const relations = await fetchRelations() as Relation[]

      setNodes(mapPersonsToNodes(persons, handleEditNode))
      setEdges(mapRelationsToEdges(relations))
    } catch (error) {
      console.error("Error loading graph", error)
    } finally {
      setIsLoading(false)
    }
  }, [handleEditNode])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadGraph()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadGraph])

  const closeModal = useCallback(() => {
    if (selectedNodeId && isTempPersonId(selectedNodeId)) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId))
    }

    setIsEditing(false)
    setSelectedNodeId(null)
    setPersonName("")
  }, [selectedNodeId])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const savePersonName = useCallback(async () => {
    if (!selectedNodeId) return
    const trimmedName = personName.trim()
    if (trimmedName === "") return

    const previousNodes = nodes

    try {
      if (isTempPersonId(selectedNodeId)) {
        const tempNode = nodes.find((node) => node.id === selectedNodeId)
        const position = tempNode?.position ?? { x: 0, y: 0 }

        setNodes((nds) =>
          nds.map((node) =>
            node.id === selectedNodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    label: trimmedName,
                    onEdit: () => handleEditNode(selectedNodeId, trimmedName)
                  }
                }
              : node
          )
        )

        const newPerson = await createPerson(trimmedName, position.x, position.y) as Person
        setNodes((nds) =>
          nds.map((node) =>
            node.id === selectedNodeId
              ? mapPersonToNode(newPerson, handleEditNode)
              : node
          )
        )
        closeModal()
        return
      }

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: trimmedName,
                  onEdit: () => handleEditNode(selectedNodeId, trimmedName)
                }
              }
            : node
        )
      )

      const updatedPerson = await updatePersonName(selectedNodeId, trimmedName) as Person
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? mapPersonToNode(updatedPerson, handleEditNode)
            : node
        )
      )
      closeModal()
    } catch (error) {
      console.error("Error updating name", error)
      setNodes(previousNodes)
    }
  }, [closeModal, handleEditNode, nodes, personName, selectedNodeId])

  const addPerson = useCallback(async () => {
    const x = Math.random() * 400
    const y = Math.random() * 400
    const id = `${TEMP_NODE_PREFIX}${Date.now()}`

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "person",
        data: {
          label: "",
          onEdit: () => handleEditNode(id, "")
        },
        position: { x, y }
      }
    ])

    setSelectedNodeId(id)
    setPersonName("")
    setIsEditing(true)
  }, [handleEditNode])

  const removePerson = useCallback(async (id: string) => {
    if (isTempPersonId(id)) {
      setNodes((nds) => nds.filter((node) => node.id !== id))
      setSelectedNodeId(null)
      setIsEditing(false)
      return
    }

    const previousNodes = nodes
    const previousEdges = edges

    setNodes((nds) => nds.filter((node) => node.id !== id))
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id))
    setSelectedNodeId(null)
    setSelectedForConnection(null)
    setSelectedEdge(null)

    try {
      await deletePerson(id)
    } catch (error) {
      console.error("Error deleting person", error)
      setNodes(previousNodes)
      setEdges(previousEdges)
    }
  }, [edges, nodes])

  const connectNodes = useCallback(async (source: string, target: string) => {
    if (source === target) return
    const existingRelation = edges.some((edge) =>
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source)
    )

    if (existingRelation) return

    try {
      const newRelation = await createRelation(Number(source), Number(target), "") as Relation
      setEdges((eds) => [...eds, mapRelationToEdge(newRelation)])
    } catch (error) {
      console.error("Error creating relation", error)
    }
  }, [edges])

  const handleNodeDragStart = useCallback((_: unknown, node: Node<PersonNodeData> | undefined) => {
    if (!node?.id) return

    previousPositions.current[node.id] = {
      x: node.position.x,
      y: node.position.y
    }
  }, [])

  const handleNodeDragStop = useCallback(async (_: unknown, node: Node<PersonNodeData>) => {
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
  }, [])

  const handleNodeClick: NodeMouseHandler = useCallback(async (_, node) => {
    const clickedId = node.id

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
      return
    }

    setSelectedNodeId(clickedId)
  }, [connectionMode, connectNodes, selectedForConnection])

  const removeRelation = useCallback(async (id: string) => {
    const previousEdges = edges

    setEdges((eds) => eds.filter((edge) => edge.id !== id))
    setSelectedEdge(null)

    try {
      await deleteRelation(id)
    } catch (error) {
      console.error("Error deleting relation", error)
      setEdges(previousEdges)
    }
  }, [edges])

  const handleEdgeClick = useCallback((_: unknown, edge: Edge) => {
    setSelectedEdge(edge)
  }, [])

  const confirmDeleteRelation = useCallback(async () => {
    if (!selectedEdge) return
    await removeRelation(selectedEdge.id)
  }, [removeRelation, selectedEdge])

  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>()

    edges.forEach((edge) => {
      if (edge.source === selectedNodeId) {
        ids.add(edge.target)
      }
      if (edge.target === selectedNodeId) {
        ids.add(edge.source)
      }
    })

    return ids
  }, [edges, selectedNodeId])

  const nodesWithStyle = useMemo(() => nodes.map((node) => {
    const isSelected = node.id === selectedNodeId
    const isConnected = connectedNodeIds.has(node.id)

    return {
      ...node,
      data: node.data,
      style: selectedForConnection === node.id
        ? {
            border: "2px solid #22c55e",
            boxShadow: "0 0 0 4px rgba(34,197,94,0.14), 0 18px 45px rgba(15,23,42,0.16)"
          }
        : isSelected
          ? {
              border: "2px solid #38bdf8",
              boxShadow: "0 0 0 4px rgba(56,189,248,0.14), 0 18px 45px rgba(15,23,42,0.16)"
            }
          : selectedNodeId
            ? isConnected
              ? {
                  border: "2px solid #60a5fa",
                  opacity: 1
                }
              : {
                  opacity: 0.24
                }
            : {}
    }
  }), [connectedNodeIds, nodes, selectedForConnection, selectedNodeId])

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setSelectedForConnection(null)
    setSelectedEdge(null)
  }, [])

  const selectNode = useCallback((id: string) => {
    setSelectedNodeId(id)
    setSelectedForConnection(null)
    setSelectedEdge(null)
  }, [])

  const edgesWithStyle = useMemo(() => edges.map((edge) => {
    const isConnected =
      edge.source === selectedNodeId || edge.target === selectedNodeId

    return {
      ...edge,
      animated: connectionMode && !selectedNodeId,
      style: selectedNodeId
        ? isConnected
          ? {
              stroke: "#0284c7",
              strokeWidth: 3
            }
          : {
              opacity: 0.12
            }
        : {}
    }
  }), [connectionMode, edges, selectedNodeId])

  return {
    nodesWithStyle,
    edgesWithStyle,
    handleNodeClick,
    handleNodeDragStart,
    handleNodeDragStop,
    onNodesChange,
    selectedNodeId,
    isLoading,
    isEditing,
    personName,
    setPersonName,
    closeModal,
    savePersonName,
    addPerson,
    removePerson,
    connectNodes,
    openPersonEditor: handleEditNode,
    connectionMode,
    setConnectionMode,
    selectedForConnection,
    removeRelation,
    handleEdgeClick,
    selectedEdge,
    confirmDeleteRelation,
    setSelectedEdge,
    handlePaneClick,
    selectNode
  }
}
