"use client";
import React from "react";
import { createClient } from "../../utils/supabase/client"; 
import { useRouter } from "next/navigation";

const page = () => {
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [disable, setDisable] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleFetch = async () => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Fetching went wrong");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    handleFetch();
  }, []);
  const handlePost = async () => {
    if (!input.trim()) return;
    setError(false);
    setLoading(true);
    setDisable(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input, completed: false }),
      });
      if (!response.ok) {
        throw new Error("Posting went wrong");
      }
      const data = await response.json();
      setTasks((prev) => [...prev, data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setDisable(false);
      setInput("");
    }
  };
  const handlekeyDown = (e) => {
    if (e.key === "Enter") {
      handlePost();
    }
  };

  const handleDelete = async (id) => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Deleting went wrong");
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  const handlePatch = async (id, currentStatus) => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (!response.ok) {
        throw new Error("Patching went wrong");
      }
      const updatedTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handlekeyDown}
            value={input}
            type="text"
            placeholder="Add a task..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePost}
            disabled={disable}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {/* States */}
        {error && <p className="text-red-500 text-sm mb-2">{error.message}</p>}
        {loading && <p className="text-gray-500 text-sm mb-2">Loading...</p>}

        {/* Tasks */}
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2"
            >
              <span
                className={`text-gray-800 ${
                  t.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {t.title}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePatch(t.id, t.completed)}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  {t.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default page;
