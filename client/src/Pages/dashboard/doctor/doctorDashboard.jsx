import React from "react";
import DocHeader from "../../../Components/dashboard/doctor/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/DocSidebar";
import DocCenterContent from "../../../Components/dashboard/doctor/DocCenterContent";

const DoctorDashboard = () => {
  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        <DocSidebar />
        <DocCenterContent />
      </div>
    </>
  );
};

export default DoctorDashboard;
