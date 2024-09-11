import { useEffect, useState, useCallback } from "react";
import Table from "../../../common/Table";
import useDocCall from "../../../../Hooks/useDocCall";
import { useSelector } from "react-redux";

const DocTodayApp = () => {
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const { getTodayAppointments } = useDocCall();
  const doctorId = useSelector((state) => state.auth.userId);
  const [appointments, setAppointments] = useState([]);
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Time", accessor: "time" },
    { Header: "Location", accessor: "location" },
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "button" },
  ];
  // Wrap getTodayAppointments with useCallback to memoize it
  const fetchAppointments = useCallback(async () => {
    const { appointments: docApps } = await getTodayAppointments(doctorId);
    console.log("Fetched Appointments:", docApps);

    if (Array.isArray(docApps)) {
      const formattedData = docApps.map((appointment) => ({
        name: `${appointment.patient.firstname} ${appointment.patient.lastname}`,
        time: appointment.appointmentTime || "N/A",
        location: appointment.appointmentLocation || "N/A",
        status: appointment.appointmentStatus === "pending" ? (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {capitalizeFirstLetter(appointment.appointmentStatus)}
          </span>
        ) : (
          ''
        ),
        button: () => (
          <div className="space-x-2">
            <button className="bg-red-500 text-white px-2 py-1 rounded">
              Cancel
            </button>
            <button className="bg-green-500 text-white px-2 py-1 rounded">
              Reschedule
            </button>
          </div>
        ),
      }));

      setAppointments(formattedData);
    } else {
      console.error("Expected an array but got:", docApps);
    }
  }, [doctorId, getTodayAppointments]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Todays Appointments</h1>
      <Table columns={columns} data={appointments} />
    </div>
  );
};

export default DocTodayApp;
