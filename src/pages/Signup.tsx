import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(username, password);
      navigate("/login");
    } catch (err) {
      setError("User already exists");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="border p-2" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Account</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
