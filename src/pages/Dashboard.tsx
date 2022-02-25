import React, { FC, useContext } from "react";
import { Outlet } from "react-router";
import Rooms from "../components/Dashboard/Rooms";
import Navbar from "../components/Layout/Navbar";

import authContext from "../contexts/authContext";

const Dashboard: FC = () => {
  const { logout } = useContext(authContext);

  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <main
        className="flex-1 flex flex-row"
        style={{
          maxHeight: "calc(100vh - 72px)",
        }}
      >
        <Rooms />
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;