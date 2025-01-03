import {
  RxDashboard,
  RxCalendar,
  RxPieChart,
  RxPerson,
  RxChatBubble,
} from "react-icons/rx";
import { deleteCookie } from "../../../../Helpers/cookies";
import { useNavigate } from "react-router-dom";
const DocSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    deleteCookie("authToken");
    navigate("/logindoc");
  };
  const navigation = [
    { name: "Dashboard", icon: <RxDashboard />, url: "/docdash" },
    { name: "Calendar", icon: <RxCalendar /> },
    { name: "Statistics", icon: <RxPieChart /> },
    { name: "Profile", icon: <RxPerson />, url: "/doctor/profile" },
    { name: "Chat", icon: <RxChatBubble /> },
  ];

  return (
    <div className="flex flex-col justify-between w-64 h-screen space-y-1 m-3 bg-white">
      <div className="">
        {navigation.map((nav, index) => (
          <div
            key={index}
            tabIndex="0"
            onClick={() => navigate(nav.url)}
            className="flex flex-row items-center p-5 focus:bg-gray-100 hover:bg-gray-100  rounded-3xl font-semibold font-sans space-x-3 cursor-pointer"
          >
            <span className="text-2xl">{nav.icon}</span>
            <span>{nav.name}</span>
          </div>
        ))}
      </div>
      <button
        className="p-5 hover:bg-gray-100 focus:bg-gray-100 rounded-3xl"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default DocSidebar;
