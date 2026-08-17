import { useSelector } from "react-redux";

const PatHeader = () => {
  const patientName = useSelector((state) => state.auth.patientName);

  const initials = patientName
    ? patientName
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    : "P";

  return (
    <div className="flex flex-row justify-between p-5 ml-3 items-center relative">
      <h2 className="text-black text-3xl font-semibold">BookMyDoc</h2>
      <div className="flex flex-row items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
        <h4 className="text-center font-semibold">{patientName || "Patient"}</h4>
      </div>
    </div>
  );
};

export default PatHeader;
