import React, { useEffect } from "react";
import Table from "../../../common/Table";
import useDocCall from "../../../../Hooks/useDocCall";
import { useSelector } from "react-redux";

const DocTodayApp = () => {
  const { getTodayAppointments } = useDocCall();
  const doctorId = useSelector((state) => state.auth.userId);
  console.log("dd", doctorId);
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Age", accessor: "age" },
    { Header: "Email", accessor: "email" },
    { Header: "Action", accessor: "button" },
  ];

  const data = [
    {
      name: "John Doe",
      age: 28,
      email: "john@example.com",
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
    },
    {
      name: "Jane Smith",
      age: 34,
      email: "jane@example.com",
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
    },
    {
      name: "Mike Johnson",
      age: 45,
      email: "mike@example.com",
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
    },
  ];

  useEffect(() => {
    async function fetchData() {
      const docApps = await getTodayAppointments(doctorId);
      console.log("oas", docApps);
    }
    fetchData();
  }, []);
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Today's Appointments</h1>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default DocTodayApp;
