import { Card, Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Item } = Form;


const ForgotPassword = () => {

  const onFinish = async (values) => {
    console.log("📩 FORGOT PASSWORD:", values);

    try {
      const res = await fetch("http://127.0.0.1:3030/api/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      console.log("STATUS:", res.status); 

      const data = await res.json();
      console.log("📥 RESPONSE:", data); 

      if (res.ok) {
        message.success("OTP sent to your email 📧");
      } else {
        message.error(data.message || "User does not exist ❌");
      }

    } catch (error) {
      console.log("🚨 FULL ERROR:", error);
      message.error("Server not responding ❌");
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

        {/* CARD */}
        <Card
          className="w-full max-w-sm shadow-xl rounded-2xl mt-10 border border-gray-200"
          styles={{ body: { padding: "32px" } }}
        >
          <h2 className="text-center text-[#FF735C] text-xl font-semibold mb-6">
            Forgot Password
          </h2>

          <Form layout="vertical" onFinish={onFinish}>

            {/* EMAIL FIELD */}
            <Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Enter your email" },
                { type: "email", message: "Enter valid email" }
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Enter your registered email"
                className="rounded-lg"
              />
            </Item>

            {/* BUTTON */}
            <Item>
              <Button
                htmlType="submit"
                type="primary"
                className="w-full !bg-[#FF735C] hover:!bg-[#e65f4c] !border-none rounded-lg h-10"
              >
                Send OTP
              </Button>
            </Item>

            {/* BACK LINK */}
            <div className="text-center text-sm">
              <Link to="/login" className="text-blue-500">
                Back to Login
              </Link>
            </div>

          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;