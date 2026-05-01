import { Button, Card } from "antd";
import {
  BarChartOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import DailyTransactionChart from "../../shared/DailyTransactions";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  // 🔥 Fetch from backend
  const getTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
  
      // 🔥 MAIN CHANGE
      const url =
        role === "admin"
          ? "http://localhost:3030/api/admin/transactions"
          : "http://localhost:3030/api/transaction/get";
  
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setTransactions(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 Calculations
  const totalTransactions = transactions.length;

  const income = transactions
    .filter((t) => t.transactionType === "cr")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.transactionType === "dr")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;

  return (
    <div className="p-4 space-y-6">
      {/* Top Cards */}
      <div className="grid md:grid-cols-4 gap-6">

        {/* Transactions */}
        <Card className="shadow rounded-xl">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-y-2">
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                size="large"
                shape="circle"
                className="!bg-rose-600"
              />
              <h1 className="text-xl font-semibold text-rose-600">
                Transactions
              </h1>
            </div>

            <h2 className="text-3xl font-bold">
              {totalTransactions}
            </h2>
          </div>
        </Card>

        {/* Income */}
        <Card className="shadow rounded-xl">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-y-2">
              <Button
                type="primary"
                icon={<ArrowDownOutlined />}
                size="large"
                shape="circle"
                className="!bg-green-600"
              />
              <h1 className="text-xl font-semibold text-green-600">
                Income
              </h1>
            </div>

            <h2 className="text-3xl font-bold">
              ₹{income}
            </h2>
          </div>
        </Card>

        {/* Expense */}
        <Card className="shadow rounded-xl">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-y-2">
              <Button
                type="primary"
                icon={<ArrowUpOutlined />}
                size="large"
                shape="circle"
                className="!bg-red-600"
              />
              <h1 className="text-xl font-semibold text-red-600">
                Expense
              </h1>
            </div>

            <h2 className="text-3xl font-bold">
              ₹{expense}
            </h2>
          </div>
        </Card>

        {/* Balance */}
        <Card className="shadow rounded-xl">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-y-2">
              <Button
                type="primary"
                icon={<WalletOutlined />}
                size="large"
                shape="circle"
                className="!bg-blue-600"
              />
              <h1 className="text-xl font-semibold text-blue-600">
                Balance
              </h1>
            </div>

            <h2 className="text-3xl font-bold">
              ₹{balance}
            </h2>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <DailyTransactionChart transactions={transactions} />
    </div>
  );
};

export default Dashboard;