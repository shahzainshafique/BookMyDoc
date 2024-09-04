import React from "react";

const DocSidebar = () => {
  const navigation = [
    { name: "Dashboard" },
    { name: "Calendar" },
    { name: "Statistics" },
    { name: "Profile" },
    { name: "Chat" },
  ];
  return (
    <div className="flex flex-col w-64 h-screen space-y-7 bg-white">
      {navigation.map((nav) => (
        <div className="flex flex-row p-5 bg-gray-600 rounded-3xl">
          {nav.name}
        </div>
      ))}
    </div>
  );
};

export default DocSidebar;
