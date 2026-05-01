import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  Legend,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
];

const Report = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= HELPERS =================
  const isIncome = (type) =>
    ["cr", "income"].includes(type?.toLowerCase());

  const isExpense = (type) =>
    ["dr", "expense"].includes(type?.toLowerCase());

  // ================= GET DATA =================
  const getTransactions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        console.log("❌ No token found");
        return;
      }

      const res = await axios.get(
        "http://localhost:3030/api/transaction/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ DATA 👉", res.data.data);

      const sorted = (res.data.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(sorted);
    } catch (error) {
      console.log(
        "❌ ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  // ================= TOTALS =================
  const income = transactions
    .filter((item) => isIncome(item.transactionType))
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const expense = transactions
    .filter((item) => isExpense(item.transactionType))
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const saving = income - expense;

  // ================= CATEGORY DATA =================
  const categoryMap = {};

  transactions
    .filter((item) => isExpense(item.transactionType))
    .forEach((item) => {
      const category = item.title;
      categoryMap[category] =
        (categoryMap[category] || 0) + Number(item.amount);
    });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // ================= BAR DATA =================
  const barData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  // ================= UI =================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {/* ================= CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow flex gap-4 items-center">
          <div className="bg-green-500 text-white p-4 rounded-full">
            <ArrowUpOutlined />
          </div>
          <div>
            <p>Total Income</p>
            <h2 className="text-2xl font-bold text-green-600">
              ₹{income}
            </h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow flex gap-4 items-center">
          <div className="bg-red-500 text-white p-4 rounded-full">
            <ArrowDownOutlined />
          </div>
          <div>
            <p>Total Expense</p>
            <h2 className="text-2xl font-bold text-red-600">
              ₹{expense}
            </h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow flex gap-4 items-center">
          <div className="bg-blue-500 text-white p-4 rounded-full">
            <WalletOutlined />
          </div>
          <div>
            <p>Total Saving</p>
            <h2 className="text-2xl font-bold text-blue-600">
              ₹{saving}
            </h2>
          </div>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            Expense by Category
          </h2>

          {pieData.length === 0 ? (
            <p>No expense data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            Income vs Expense
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= RECENT ================= */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4">
          Recent Transactions
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3">Type</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.slice(0, 5).map((item, index) => (
                <tr key={index} className="border-b">
                  <td
                    className={`py-3 font-semibold ${
                      isIncome(item.transactionType)
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {isIncome(item.transactionType) ? "Cr" : "Dr"}
                  </td>

                  <td>{item.title}</td>
                  <td>₹{item.amount}</td>
                  <td>{item.paymentMethod}</td>
                  <td>
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Report;