import React, { useEffect, useState, useCallback } from "react";
import Table from "../../../common/Table";
import useDocCall from "../../../../Hooks/useDocCall";
import { useSelector } from "react-redux";

const DocTodayApp = () => {
  const { getTodayAppointments } = useDocCall();
  const doctorId = useSelector((state) => state.auth.userId);
  const [appointments, setAppointments] = useState([]);
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Age", accessor: "age" },
    { Header: "Email", accessor: "email" },
    { Header: "Action", accessor: "button" },
  ];
  // Wrap getTodayAppointments with useCallback to memoize it
  const fetchAppointments = useCallback(async () => {
    const { appointments: docApps } = await getTodayAppointments(doctorId);
    console.log("Fetched Appointments:", docApps);

    if (Array.isArray(docApps)) {
      const formattedData = docApps.map((appointment) => ({
        name: `${appointment.patient.firstname} ${appointment.patient.lastname}`,
        age: appointment.patient.age || "N/A",
        email: appointment.patient.email,
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
  }, [fetchAppointments]);

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Today's Appointments</h1>
      <Table columns={columns} data={appointments} />
    </div>
  );
};

export default DocTodayApp;
