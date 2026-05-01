import { Layout } from "antd";

const { Header, Footer, Content } = Layout;

const Homelayout = ({ children }) => {
  return (
    <Layout className="min-h-screen flex flex-col">

      {/* HEADER */}
      <Header className="!bg-[#FF735C] flex items-center justify-center">
        <h1 className="text-white text-lg md:text-3xl font-bold">
          Expense Tracker App
        </h1>
      </Header>

      {/* CONTENT */}
      <Content className="flex-grow bg-gray-100 p-6 m-4 rounded-xl flex items-center justify-center">
        {children}
      </Content>

      {/* FOOTER */}
      <Footer className="!bg-[#FF735C] flex items-center justify-center">
        <h1 className="text-white text-lg md:text-2xl font-bold">
          Footer
        </h1>
      </Footer>

    </Layout>
  );
};

export default Homelayout;