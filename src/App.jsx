import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Login from "./components/Home/Login";
import Signup from "./components/Home/Signup";
import PageNotFound from "./components/PageNotFound";
import Userlayout from "./components/User/Userlayout";
import AdminLayout from "./components/Admin/AdminLayout";
import ForgotPassword from "./components/Home/ForgotPassword";

import Dashboard from "./components/User/Dashboard";
import Report from "./components/User/Report";
import Transactions from "./components/User/Trasactions";

// ✅ ADMIN USERS PAGE
import Users from "./components/Admin/Users";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔹 DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔹 AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔹 USER ROUTES */}
        <Route path="/app/user" element={<Userlayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>

        {/* 🔥 ADMIN ROUTES */}
        <Route path="app/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="transactions" element={<Transactions />} />

          {/* ✅ FIX: USERS ROUTE ADDED */}
          <Route path="users" element={<Users />} />
        </Route>

        {/* 🔹 404 */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;