import { Card, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";


const { Item } = Form;

const Signup = () => {

  const handleForgot = () => {
    console.log("Forgot password clicked");
  };

  const onFinish = async (values) => {
    console.log("FORM SUBMITTED", values);

    try {
      const res = await fetch("http://localhost:3030/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert(data.message); // success
      } else {
        alert(data.message || "Signup failed");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
        <img
          src="/exp-img.jpg"
          alt="illustration"
          className="w-3/4 object-contain"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 px-6">

        <div className="w-full absolute top-0 left-0 bg-[#FF735C] text-white text-center py-3 font-semibold text-lg">
          Expense Tracker App
        </div>

        <Card className="w-full max-w-sm shadow-xl rounded-2xl mt-10">

          <h2 className="text-center text-[#FF735C] text-xl font-semibold mb-6">
            Register To Track Your Expense
          </h2>

          <Form layout="vertical" onFinish={onFinish}>

            <Item name="fullname" rules={[{ required: true, message: "Enter full name" }]}>
              <Input size="large" prefix={<UserOutlined />} placeholder="Full Name" />
            </Item>

            <Item name="email" rules={[{ required: true, message: "Enter email" }]}>
              <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
            </Item>

            <Item name="mobile" rules={[{ required: true, message: "Enter mobile" }]}>
              <Input size="large" prefix={<PhoneOutlined />} placeholder="Mobile Number" />
            </Item>

            <Item name="password" rules={[{ required: true, message: "Enter password" }]}>
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" />
            </Item>

            <Item>
              <Button
                htmlType="submit"
                type="primary"
                className="w-full !bg-[#FF735C] hover:!bg-[#e65f4c] !border-none rounded-lg h-10"
              >
                Sign Up
              </Button>
            </Item>

            <div className="flex justify-between text-sm mt-2">
              <Link to="#" onClick={handleForgot} className="text-blue-500">
                Forgot Password
              </Link>

              <Link to="/" className="text-blue-500">
                Already have an account?
              </Link>
            </div>

          </Form>

        </Card>

      </div>
    </div>
  );
};

export default Signup;