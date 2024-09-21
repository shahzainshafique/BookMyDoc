import { useEffect, useState, useCallback } from "react";
import Table from "../../../common/Table";
import useDocCall from "../../../../Hooks/useDocCall";
import { useSelector } from "react-redux";
import Modal from "../../../common/Modal";
import { FaCalendarTimes } from "react-icons/fa";

const DocTodayApp = () => {
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getStatusLabel = (status) => {
    const capitalizedStatus = capitalizeFirstLetter(status);

    switch (status) {
      case "pending":
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {capitalizedStatus}
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-700 dark:text-red-300">
            {capitalizedStatus}
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            {capitalizedStatus}
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {capitalizedStatus}
          </span>
        );
    }
  };

  const { getTodayAppointments, cancelAppointment, rescheduleAppointment } =
    useDocCall();
  const doctorId = useSelector((state) => state.auth.userId);
  const [appointments, setAppointments] = useState([]);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const columns = [
    { Header: "Patient's Name", accessor: "name" },
    { Header: "Time", accessor: "time" },
    { Header: "Location", accessor: "location" },
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "button" },
  ];

  const fetchAppointments = useCallback(async () => {
    const { appointments: docApps } = await getTodayAppointments(doctorId);
    console.log("Fetched Appointments:", docApps);

    if (Array.isArray(docApps)) {
      const formattedData = docApps.map((appointment) => ({
        ...appointment,
        name: `${appointment.patient.firstname} ${appointment.patient.lastname}`,
        time: appointment.appointmentTime || "N/A",
        location: appointment.appointmentLocation || "N/A",
        status: getStatusLabel(appointment.appointmentStatus),
        button: () => (
          <div className="space-x-2">
            <button
              className="bg-gray-200 text-gray-600 px-2 py-1 rounded"
              onClick={() => handleCancellation(appointment)}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={() => handleReschedule(appointment)}
            >
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

  const handleCancellation = async (appointment) => {
    console.log(appointment);
    const postData = {
      patientId: appointment.patient._id,
      doctorId: doctorId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
    };

    const cancelRes = await cancelAppointment(postData);

    if (cancelRes) await fetchAppointments();
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    const postData = {
      patientId: selectedAppointment.patient._id,
      doctorId: doctorId,
      oldAppointmentDate: selectedAppointment.appointmentDate,
      oldAppointmentTime: selectedAppointment.appointmentTime,
      newAppointmentDate: newDate,
      newAppointmentTime: newTime,
    };

    const rescheduleRes = await rescheduleAppointment(postData);

    if (rescheduleRes) {
      await fetchAppointments();
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="font-semibold text-2xl">Today Appointments</h1>
      {appointments.length > 0 ? (
        <Table columns={columns} data={appointments} />
      ) : (
        <div className="flex flex-col rounded-2xl space-y-4 p-20 items-center justify-center bg-white">
          <FaCalendarTimes className="text-3xl" />
          <h2 className="text-2xl">No Appointments for Today</h2>
          <h3 className="text-xl">Add Some?</h3>
        </div>
      )}

      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title="Reschedule Appointment"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2">New Date:</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block mb-2">New Time:</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleRescheduleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm Reschedule
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DocTodayApp;
