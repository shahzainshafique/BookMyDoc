import React from "react";
import SideBar from "../../../Components/dashboard/SideBar";
import DoctorDashContent from "../../../Components/dashboard/DoctorDashContent";
import DocHeader from "../../../Components/dashboard/doctor/DocHeader";

const DoctorDashboard = () => {
  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        {/* <SideBar />
      <DoctorDashContent /> */}
      </div>
    </>
  );
};

export default DoctorDashboard;
