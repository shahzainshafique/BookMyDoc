import React from "react";
import {
  FaUserInjured,
  FaFileMedical,
  FaStethoscope,
  FaMedal,
} from "react-icons/fa"; // Example icons from react-icons

const DocDashStats = () => {
  const data = [
    { name: "Patients", count: 117, icon: <FaUserInjured /> },
    { name: "Reports", count: 12, icon: <FaFileMedical /> },
    { name: "Consultations", count: 34, icon: <FaStethoscope /> },
    { name: "Experience", count: 9, icon: <FaMedal /> },
  ];
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Statistics</h1>
      <div className="flex flex-row items-center justify-evenly p-6 rounded-2xl bg-white space-x-5">
        {data.map((d) => (
          <div className="flex flex-row items-center space-x-4">
            <span className="text-4xl">{d.icon}</span>
            <div className="flex flex-col">
              <h1 className="text-2xl">{d.count}</h1>
              {d.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocDashStats;
