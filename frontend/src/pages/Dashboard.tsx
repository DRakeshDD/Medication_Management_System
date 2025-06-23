import { useState, useEffect } from "react";
import { addMedication, getMedications, markAsTaken } from "../services/medications";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "" });
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem("user_id") || "0");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    const data = await getMedications(userId);
    setMedications(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMedication({ ...form, user_id: userId, date: new Date().toISOString().split("T")[0] });
    setForm({ name: "", dosage: "", frequency: "" });
    fetchMeds();
  };

  const handleTaken = async (id: number) => {
    await markAsTaken(id);
    fetchMeds();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">Medication Dashboard</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2" />
        <input type="text" placeholder="Dosage" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} className="border p-2" />
        <input type="text" placeholder="Frequency" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} className="border p-2" />
        <button className="bg-blue-500 text-white p-2 rounded">Add Medication</button>
      </form>

      <ul className="space-y-2">
        {medications.map((med: any) => (
          <li key={med.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p><strong>{med.name}</strong> - {med.dosage} ({med.frequency})</p>
              <p>Date: {med.date}</p>
              <p>Status: {med.taken ? "✅ Taken" : "❌ Not taken"}</p>
            </div>
            {!med.taken && (
              <button onClick={() => handleTaken(med.id)} className="bg-green-500 text-white px-3 py-1 rounded">Mark as Taken</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
