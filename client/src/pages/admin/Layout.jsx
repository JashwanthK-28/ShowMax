import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";

const Layout = () => {
  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 px-4 py-10 md:">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
