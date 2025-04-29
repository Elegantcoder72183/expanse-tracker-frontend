import { useEffect, useState } from "react";
import ExpansesPieChart from "../components/ExpansesPieChart";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const categories = [
    "Food",
    "Travel",
    "Investment",
    "Shopping",
    "Utilities",
    "Health",
    "Entertainment",
    "Education",
    "Other",
  ];

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setExpenses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${BASE_URL}/api/expenses/${editingId}`
        : `${BASE_URL}/api/expenses`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ amount: "", category: "", description: "", date: "" });
        setEditingId(null); // Reset editing mode
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date.slice(0, 10), // Make sure date input accepts the format
    });
    setEditingId(expense._id);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold my-4">Dashboard</h2>
        <button
          className="bg-red-700 h-10 w-28 rounded-md text-white text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAddOrUpdateExpense}
        className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <input
          type="number"
          placeholder="Amount"
          className="p-2 border rounded"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />

        <select
          className="p-2 border rounded"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="date"
          className="p-2 border rounded"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <button
          className="col-span-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Your Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul>
            {expenses.map((expense) => (
              <li
                key={expense._id}
                className="flex justify-between items-center mb-2"
              >
                <div>
                  ₹{expense.amount} - {expense.category} (
                  {expense.date.slice(0, 10)})
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <ExpansesPieChart expenses={expenses} />
      </div>
    </div>
  );
}

export default Dashboard;
