import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// Last 30 Days Dates
const getLast30Days = () => {
  const days = [];

  for (let i = 29; i >= 0; i--) {
    days.push(dayjs().subtract(i, "day").format("YYYY-MM-DD"));
  }

  return days;
};

const DailyTransactionChart = ({ transactions = [] }) => {
  const dailyTotals = {};

  // Calculate Daily Total
  transactions?.forEach((txn) => {
    const dateStr = dayjs(txn.date?.$date || txn.date).format("YYYY-MM-DD");

    if (!dailyTotals[dateStr]) {
      dailyTotals[dateStr] = 0;
    }

    dailyTotals[dateStr] += Number(txn.amount);
  });

  // Prepare Chart Data
  const chartData = getLast30Days().map((date) => ({
    date: dayjs(date).format("DD MMM"),
    amount: dailyTotals[date] || 0,
  }));

  return (
    <Card
      title="Daily Transactions (Last 30 Days)"
      className="shadow rounded-xl mt-6"
    >
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="amount"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DailyTransactionChart;