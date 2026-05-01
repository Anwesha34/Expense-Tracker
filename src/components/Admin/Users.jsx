import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Input, Tag, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3030/api/user/all-users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const formatted = res.data.map((user) => ({
        key: user._id,
        name: user.fullname,
        email: user.email,
        role: user.role,
        date: new Date(user.createdAt).toLocaleDateString(),
        status: user.status,
      }));

      setUsers(formatted);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3030/api/user/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchUsers(); // refresh after toggle
    } catch (err) {
      console.log("Toggle error:", err);
    }
  };

  // ================= SEARCH =================
  const filteredData = users.filter((user) =>
    Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // ================= TABLE =================
  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) =>
        role === "admin" ? (
          <Tag color="blue">Admin</Tag>
        ) : (
          <Tag color="green">User</Tag>
        ),
    },
    {
      title: "Joined Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          onChange={() => toggleStatus(record.key)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card className="shadow rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">User List</h2>

          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Users;