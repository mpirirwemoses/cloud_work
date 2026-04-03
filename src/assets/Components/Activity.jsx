import React, { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const RoutineApp = () => {
  const [activities, setActivities] = useState([]);
  const [activityInput, setActivityInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch all activities from backend
  const fetchActivities = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/activities`);
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Add or Update activity
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityInput.trim()) return;

    try {
      if (editingIndex !== null) {
        // Update activity
        const activity = activities[editingIndex];
        await fetch(`${BACKEND_URL}/activities/${activity.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: activityInput }),
        });

        const updatedActivities = [...activities];
        updatedActivities[editingIndex].name = activityInput;
        setActivities(updatedActivities);
        setEditingIndex(null);
      } else {
        // Add new activity
        const res = await fetch(`${BACKEND_URL}/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: activityInput }),
        });
        const newActivity = await res.json();
        setActivities([...activities, newActivity]);
      }

      setActivityInput("");
    } catch (err) {
      console.log(err);
    }
  };

  // Delete activity
  const handleDelete = async (index) => {
    const activity = activities[index];
    try {
      await fetch(`${BACKEND_URL}/activities/${activity.id}`, { method: "DELETE" });
      setActivities(activities.filter((_, i) => i !== index));
    } catch (err) {
      console.log(err);
    }
  };

  // Edit activity
  const handleEdit = (index) => {
    setActivityInput(activities[index].name);
    setEditingIndex(index);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Routine Activities</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={activityInput}
          onChange={(e) => setActivityInput(e.target.value)}
          placeholder="Add an activity"
          className="flex-grow border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </form>

      {activities.length === 0 ? (
        <p className="text-center text-gray-500">No activities yet</p>
      ) : (
        <ul>
          {activities.map((activity, index) => (
            <li
              key={activity.id}
              className="flex justify-between items-center mb-2 border-b py-1"
            >
              <span>{activity.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoutineApp;