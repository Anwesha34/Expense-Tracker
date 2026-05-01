import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  Space,
  Popconfirm,
  message,
} from "antd";

import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const Transactions = () => {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);

  // ================= FETCH DATA =================
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3030/api/transaction/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = res.data.data.map((item) => ({
        key: item._id,
        type:
          item.transactionType === "cr"
            ? "Income"
            : "Expense",
        title: item.title,
        amount: item.amount,
        payment: item.paymentMethod,
        notes: item.notes,
        date: item.date,
      }));

      setData(formatted);
    } catch (err) {
      console.log(err);
      message.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ================= MODAL =================
  const showModal = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);

    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });

    setOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3030/api/transaction/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Transaction deleted");
      fetchTransactions();
    } catch (err) {
      console.log(err);
      message.error("Delete failed");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        transactionType:
          values.type === "Income" ? "cr" : "dr",
        title: values.title,
        amount: values.amount,
        paymentMethod: values.payment,
        notes: values.notes,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (editing) {
        // UPDATE
        await axios.put(
          `http://localhost:3030/api/transaction/update/${editing.key}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        message.success("Transaction updated successfully");
      } else {
        // CREATE
        await axios.post(
          "http://localhost:3030/api/transaction/create",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        message.success("Transaction created successfully");
      }

      fetchTransactions();
      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  // ================= SEARCH =================
  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // ================= TABLE =================
  const columns = [
    {
      title: "Transaction Type",
      dataIndex: "type",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => `₹${text}`,
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
    },
    {
      title: "Notes",
      dataIndex: "notes",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />

          <Popconfirm
            title="Delete Transaction?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button
              danger
              ghost
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card className="shadow rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">
            Transaction List
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search by all"
              prefix={<SearchOutlined />}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              style={{ width: 220 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add new transaction
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        open={open}
        footer={false}
        onCancel={() => setOpen(false)}
        title={
          editing
            ? "Update transaction"
            : "Add new transaction"
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Form.Item
              label="Transaction Type"
              name="type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Transaction Type">
                <Option value="Income">Income</Option>
                <Option value="Expense">Expense</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter amount" />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>

            <Form.Item
              label="Payment Method"
              name="payment"
              rules={[{ required: true }]}
            >
              <Select placeholder="Payment Method">
                <Option value="Cash">Cash</Option>
                <Option value="UPI">UPI</Option>
                <Option value="Card">Card</Option>
                <Option value="Online">Online</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <div className="text-right">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Transactions;