import type { Edge, Node } from "reactflow"

export type Person = {
  id: number
  name: string
  position_x: number
  position_y: number
}

export type Relation = {
  id: number
  person1_id: number
  person2_id: number
  relation_type: string | null
}

export type PersonNodeData = {
  label: string
  onEdit: () => void
}

export function mapPersonsToNodes(
  persons: Person[],
  onEdit: (id: string, name: string) => void
): Node<PersonNodeData>[] {
  return persons.map((person) => mapPersonToNode(person, onEdit))
}

export function mapPersonToNode(
  person: Person,
  onEdit: (id: string, name: string) => void
): Node<PersonNodeData> {
  const id = String(person.id)

  return {
    id,
    type: "person",
    data: {
      label: person.name,
      onEdit: () => onEdit(id, person.name)
    },
    position: {
      x: person.position_x,
      y: person.position_y
    }
  }
}

export function mapRelationsToEdges(relations: Relation[]): Edge[] {
  return relations.map(mapRelationToEdge)
}

export function mapRelationToEdge(relation: Relation): Edge {
  return {
    id: String(relation.id),
    source: String(relation.person1_id),
    target: String(relation.person2_id)
  }
}
