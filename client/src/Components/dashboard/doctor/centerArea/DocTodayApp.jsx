import React from "react";
import Table from "../../../common/Table";

const DocTodayApp = () => {
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
      button: {
        label: "View",
        onClick: (row) => alert(`Viewing ${row.name}'s details`),
      },
    },
    {
      name: "Jane Smith",
      age: 34,
      email: "jane@example.com",
      button: {
        label: "Edit",
        onClick: (row) => alert(`Editing ${row.name}'s details`),
      },
    },
    {
      name: "Mike Johnson",
      age: 45,
      email: "mike@example.com",
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Today's Appointments</h1>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default DocTodayApp;
