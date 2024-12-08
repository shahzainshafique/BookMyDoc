import DocHeader from "../../../Components/dashboard/doctor/common/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/common/DocSidebar";
import DocCenterContent from "../../../Components/dashboard/doctor/centerArea/DocCenterContent";

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
