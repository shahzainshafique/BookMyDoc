import React from "react";
import SideBar from "../../../Components/dashboard/SideBar";
import DoctorDashContent from "../../../Components/dashboard/DoctorDashContent";
import Header from "../../../Components/header/Header";

const DoctorDashboard = () => {
  return (<>
      <Header/>
    <div className="h-screen flex">
      <SideBar />
      <DoctorDashContent />
    </div>
    </>
  );
};

export default DoctorDashboard;
