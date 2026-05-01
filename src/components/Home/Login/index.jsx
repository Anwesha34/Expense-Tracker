import { Card, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Item } = Form;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("🟡 LOGIN DATA:", values);

    try {
      const res = await fetch("http://127.0.0.1:3030/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      // 🔥 Handle non-JSON error (very important)
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server did not return JSON");
      }

      console.log("📥 RESPONSE:", data);

      if (res.ok) {
        console.log("✅ Login Successful");

        // ✅ Save token
        localStorage.setItem("token", data.token);

        // ✅ Get role safely
        const role = data?.role || data?.user?.role;

        console.log("👤 ROLE:", role);

        // ✅ Save role
        localStorage.setItem("role", role);

        // 🔥 Correct Navigation
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "user") {
          navigate("/app/user/dashboard");
        } else {
          navigate("/login");
        }

      } else {
        alert(data.message || "Login failed ❌");
      }

    } catch (error) {
      console.log("🚨 ERROR:", error);
      alert("Something went wrong or server error");
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE IMAGE */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
        <img
          src="/exp-img.jpg"
          alt="illustration"
          className="w-3/4 object-contain"
        />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-6">

        {/* HEADER */}
        <div className="w-full absolute top-0 left-0 bg-[#FF735C] text-white text-center py-3 font-semibold text-lg">
          Expense Tracker App
        </div>

        <Card
          className="w-full max-w-sm shadow-xl rounded-2xl mt-10 border border-gray-200"
          styles={{ body: { padding: "32px" } }}
        >
          <h2 className="text-center text-[#FF735C] text-xl font-semibold mb-6">
            Track Your Expense
          </h2>

          <Form layout="vertical" onFinish={onFinish}>

            <Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Enter email" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Enter your email"
                className="rounded-lg"
              />
            </Item>

            <Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Enter password" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                className="rounded-lg"
              />
            </Item>

            <Item>
              <Button
                htmlType="submit"
                type="primary"
                className="w-full !bg-[#FF735C] hover:!bg-[#e65f4c] !border-none rounded-lg h-10"
              >
                Login
              </Button>
            </Item>

            <div className="flex justify-between text-sm mt-2">
              <Link to="/forgot-password" className="text-blue-500">
                Forgot Password
              </Link>

              <Link to="/signup" className="text-blue-500">
                Don't have an account?
              </Link>
            </div>

          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;