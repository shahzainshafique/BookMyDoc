import React from "react";
import SideBar from "../../../Components/dashboard/SideBar";
import DoctorDashContent from "../../../Components/dashboard/DoctorDashContent";
import DocHeader from "../../../Components/dashboard/doctor/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/DocSidebar";

const DoctorDashboard = () => {
  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        <DocSidebar />
      </div>
    </>
  );
};

export default DoctorDashboard;
