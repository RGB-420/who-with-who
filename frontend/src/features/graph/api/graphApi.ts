const API_URL = import.meta.env.VITE_API_URL

// 🧍 GET personas
export async function fetchPersons() {
  const res = await fetch(`${API_URL}/persons`)
  if (!res.ok) throw new Error("Error fetching persons")
  return res.json()
}

// 🔗 GET relaciones
export async function fetchRelations() {
  const res = await fetch(`${API_URL}/relations`)
  if (!res.ok) throw new Error("Error fetching relations")
  return res.json()
}

// ➕ POST persona
export async function createPerson(
  name: string,
  x: number,
  y: number
) {
  const res = await fetch(`${API_URL}/persons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      position_x: x,
      position_y: y
    })
  })

  if (!res.ok) throw new Error("Error creating person")

  return res.json()
}

// 🔗 POST relación
export async function createRelation(
  person1_id: number,
  person2_id: number,
  relation_type: string
) {
  const res = await fetch(`${API_URL}/relations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      person1_id,
      person2_id,
      relation_type
    })
  })

  if (!res.ok) throw new Error("Error creating relation")

  return res.json()
}

// 📍 PUT posición
export async function updatePersonPosition(
  id: string,
  x: number,
  y: number
) {
  const res = await fetch(`${API_URL}/persons/${id}/position`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ x, y })
  })

  if (!res.ok) throw new Error("Error updating position")

  return res.json()
}

export async function updatePersonName(id: string, name: string) {
  const res = await fetch(`${API_URL}/persons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })

  if (!res.ok) {
    throw new Error("Error updating person name")
  }

  return res.json()
}

export async function deletePerson(id: string) {
  const res = await fetch(`${API_URL}/persons/${id}`, {
    method: "DELETE"
  })

  if (!res.ok) throw new Error("Error deleting person")
}

export async function deleteRelation(id: string) {
  const res = await fetch(`${API_URL}/relations/${id}`, {
    method: "DELETE"
  })

  if (!res.ok) throw new Error("Error deleting relation")
}