import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Bounce, toast } from "react-toastify";

import Field from "../../../Components/common/Field";
import Modal from "../../../Components/common/Modal";
import PatHeader from "../../../Components/dashboard/patient/common/PatHeader";
import PatSidebar from "../../../Components/dashboard/patient/common/PatSidebar";
import usePatientCall from "../../../Hooks/usePatientCall";

const toastOptions = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Bounce,
};

const today = new Date().toISOString().split("T")[0];

const rescheduleSchema = yup.object().shape({
  newAppointmentDate: yup
    .date()
    .typeError("New date is required")
    .min(new Date(today), "Please pick a future date")
    .required("New date is required"),
  newAppointmentTime: yup.string().required("New time is required"),
});

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
  rescheduled: "bg-blue-100 text-blue-700",
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : "—";

const MyAppointments = () => {
  const { getMyAppointments, cancelAppointment, rescheduleAppointment } =
    usePatientCall();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(rescheduleSchema) });

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    const data = await getMyAppointments();
    setAppointments(data?.appointments || []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const isActionable = (status) =>
    status !== "cancelled" && status !== "completed";

  const handleCancel = async (appointment) => {
    if (!appointment.doctor?._id) {
      toast.error("Doctor information missing", toastOptions);
      return;
    }
    const res = await cancelAppointment({
      appointmentId: appointment.appointmentId,
      doctorId: appointment.doctor._id,
    });
    if (res?.error) {
      toast.error(res.error, toastOptions);
      return;
    }
    toast.success(
      `Cancelled. Fee: $${res.cancellationFee ?? 0}`,
      toastOptions
    );
    loadAppointments();
  };

  const openReschedule = (appointment) => {
    setRescheduleTarget(appointment);
    reset();
  };

  const closeReschedule = () => {
    setRescheduleTarget(null);
    reset();
  };

  const onReschedule = async (formData) => {
    const res = await rescheduleAppointment({
      appointmentId: rescheduleTarget.appointmentId,
      doctorId: rescheduleTarget.doctor._id,
      newAppointmentDate: formData.newAppointmentDate,
      newAppointmentTime: formData.newAppointmentTime,
    });
    if (res?.error) {
      toast.error(res.error, toastOptions);
      return;
    }
    toast.success("Appointment rescheduled!", toastOptions);
    closeReschedule();
    loadAppointments();
  };

  return (
    <>
      <PatHeader />
      <div className="min-h-screen flex">
        <PatSidebar />
        <section className="flex flex-col bg-gray-100 rounded-3xl m-5 p-6 space-y-6 flex-1">
          <div>
            <h1 className="text-2xl font-semibold">My Appointments</h1>
            <p className="text-gray-500">
              View, reschedule, or cancel your upcoming appointments.
            </p>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500">
              You have no appointments yet. Book one from “Find a Doctor”.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt.appointmentId || appt._id}
                  className="bg-white rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {appt.doctor
                        ? `Dr. ${appt.doctor.firstname} ${appt.doctor.lastname}`
                        : "Doctor"}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {appt.doctor?.specialization || "General Practitioner"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(appt.appointmentDate)} at{" "}
                      {appt.appointmentTime || "—"} · {appt.appointmentLocation}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusStyles[appt.appointmentStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {appt.appointmentStatus}
                    </span>
                    {isActionable(appt.appointmentStatus) && (
                      <>
                        <button
                          onClick={() => openReschedule(appt)}
                          className="text-sm px-3 py-1.5 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appt)}
                          className="text-sm px-3 py-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={!!rescheduleTarget}
        onClose={closeReschedule}
        title="Reschedule Appointment"
      >
        <form onSubmit={handleSubmit(onReschedule)} className="space-y-4">
          <Field
            label="New Date"
            type="date"
            regVal="newAppointmentDate"
            register={register}
            errors={errors}
            min={today}
          />
          <Field
            label="New Time"
            type="time"
            regVal="newAppointmentTime"
            register={register}
            errors={errors}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Confirm Reschedule"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default MyAppointments;
