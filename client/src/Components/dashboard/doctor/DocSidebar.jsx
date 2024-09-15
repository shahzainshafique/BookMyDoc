import {
  RxDashboard,
  RxCalendar,
  RxPieChart,
  RxPerson,
  RxChatBubble,
} from "react-icons/rx";

const DocSidebar = () => {
  const navigation = [
    { name: "Dashboard", icon: <RxDashboard /> },
    { name: "Calendar", icon: <RxCalendar /> },
    { name: "Statistics", icon: <RxPieChart /> },
    { name: "Profile", icon: <RxPerson /> },
    { name: "Chat", icon: <RxChatBubble /> },
  ];

  return (
    <div className="flex flex-col justify-between w-64 h-screen space-y-1 m-3 bg-white">
      <div className="space-y-4">
        {navigation.map((nav, index) => (
          <div
            key={index}
            tabIndex="0"
            className="flex flex-row items-center p-5 focus:bg-gray-100 hover:bg-gray-100  rounded-3xl font-semibold font-sans space-x-3"
          >
            <span className="text-2xl">{nav.icon}</span>
            <span>{nav.name}</span>
          </div>
        ))}
      </div>
      <div className="p-5 hover:bg-gray-100 focus:bg-gray-100 rounded-3xl">
        Logout
      </div>
    </div>
  );
};

export default DocSidebar;
