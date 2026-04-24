import type { Node, Edge } from "reactflow"

export function mapPersonsToNodes(persons: any[], onEdit: (id: string, name: string) => void): Node[] {
  return persons.map((p) => ({
    id: String(p.id),
    type: "person", // 🔥 CLAVE
    data: {
      label: p.name,
      onEdit: () => onEdit(String(p.id), p.name)
    },
    position: {
      x: p.position_x,
      y: p.position_y
    }
  }))
}

export function mapRelationsToEdges(relations: any[]): Edge[] {
  return relations.map((r) => ({
    id: String(r.id), // 🔥 usar ID real
    source: String(r.person1_id),
    target: String(r.person2_id)
  }))
}