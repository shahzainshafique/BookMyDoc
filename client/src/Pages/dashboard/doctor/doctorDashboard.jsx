import React from "react";
import SideBar from "../../../Components/dashboard/SideBar";
import DoctorDashContent from "../../../Components/dashboard/DoctorDashContent";

const DoctorDashboard = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <DoctorDashContent />
    </div>
  );
};

export default DoctorDashboard;
