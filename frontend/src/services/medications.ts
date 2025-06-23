const API = "http://localhost:4000";

export async function addMedication(data: any) {
  const res = await fetch(`${API}/medications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMedications(userId: number) {
  const res = await fetch(`${API}/medications/${userId}`);
  return res.json();
}

export async function markAsTaken(id: number) {
  const res = await fetch(`${API}/medications/${id}`, {
    method: "PUT",
  });
  return res.json();
}
