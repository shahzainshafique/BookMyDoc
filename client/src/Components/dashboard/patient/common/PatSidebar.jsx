import { RxDashboard, RxCalendar } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteCookie } from "../../../../Helpers/cookies";
import { logoutSuccess } from "../../../../Features/authSlice";

const PatSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    deleteCookie("authToken");
    deleteCookie("userType");
    dispatch(logoutSuccess());
    navigate("/patient/login");
  };

  const navigation = [
    { name: "Find a Doctor", icon: <RxDashboard />, url: "/patientdash" },
    {
      name: "My Appointments",
      icon: <RxCalendar />,
      url: "/patient/appointments",
    },
  ];

  return (
    <div className="flex flex-col justify-between w-64 h-screen space-y-1 m-3 bg-white">
      <div>
        {navigation.map((nav, index) => (
          <div
            key={index}
            tabIndex="0"
            onClick={() => navigate(nav.url)}
            className={`flex flex-row items-center p-5 hover:bg-gray-100 rounded-3xl font-semibold font-sans space-x-3 cursor-pointer ${
              location.pathname === nav.url ? "bg-gray-100" : ""
            }`}
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

export default PatSidebar;
