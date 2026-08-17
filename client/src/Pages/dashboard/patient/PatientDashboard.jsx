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
import doctorPlaceholder from "../../../Assets/doctor.png";

const url = import.meta.env.VITE_BACKEND_URL;

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

// Booking is not allowed in the past.
const today = new Date().toISOString().split("T")[0];

const bookingSchema = yup.object().shape({
  appointmentDate: yup
    .date()
    .typeError("Appointment date is required")
    .min(new Date(today), "Please pick a future date")
    .required("Appointment date is required"),
  appointmentTime: yup.string().required("Appointment time is required"),
  appointmentLocation: yup.string().required("Appointment location is required"),
});

const doctorImage = (doctor) =>
  doctor.profileImage ? `${url}/${doctor.profileImage}` : doctorPlaceholder;

const PatientDashboard = () => {
  const { getDoctors, bookAppointment } = usePatientCall();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(bookingSchema) });

  const loadDoctors = useCallback(
    async (searchTerm = "") => {
      setLoading(true);
      const data = await getDoctors(searchTerm);
      setDoctors(Array.isArray(data) ? data : []);
      setLoading(false);
    },
    // getDoctors is recreated each render; we intentionally call it here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadDoctors(search.trim());
  };

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    reset();
  };

  const closeBooking = () => {
    setSelectedDoctor(null);
    reset();
  };

  const onBook = async (formData) => {
    const body = {
      doctorId: selectedDoctor._id,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      appointmentLocation: formData.appointmentLocation,
    };
    const res = await bookAppointment(body);
    if (res?.error) {
      toast.error(res.error, toastOptions);
      return;
    }
    toast.success("Appointment booked!", toastOptions);
    closeBooking();
  };

  return (
    <>
      <PatHeader />
      <div className="min-h-screen flex">
        <PatSidebar />
        <section className="flex flex-col bg-gray-100 rounded-3xl m-5 p-6 space-y-6 flex-1">
          <div>
            <h1 className="text-2xl font-semibold">Find a Doctor</h1>
            <p className="text-gray-500">
              Browse doctors and book an appointment that works for you.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 rounded-lg hover:bg-blue-600 transition"
            >
              Search
            </button>
          </form>

          {loading ? (
            <p className="text-gray-500">Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <p className="text-gray-500">No doctors found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center text-center space-y-3"
                >
                  <img
                    src={doctorImage(doctor)}
                    alt={`${doctor.firstname} ${doctor.lastname}`}
                    onError={(e) => {
                      e.currentTarget.src = doctorPlaceholder;
                    }}
                    className="h-24 w-24 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      Dr. {doctor.firstname} {doctor.lastname}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {doctor.specialization || "General Practitioner"}
                    </p>
                  </div>
                  <button
                    onClick={() => openBooking(doctor)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={!!selectedDoctor}
        onClose={closeBooking}
        title={
          selectedDoctor
            ? `Book with Dr. ${selectedDoctor.firstname} ${selectedDoctor.lastname}`
            : "Book Appointment"
        }
      >
        <form onSubmit={handleSubmit(onBook)} className="space-y-4">
          <Field
            label="Appointment Date"
            type="date"
            regVal="appointmentDate"
            register={register}
            errors={errors}
            min={today}
          />
          <Field
            label="Appointment Time"
            type="time"
            regVal="appointmentTime"
            register={register}
            errors={errors}
          />
          <Field
            label="Location"
            type="text"
            placeholder="e.g. City Clinic"
            regVal="appointmentLocation"
            register={register}
            errors={errors}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-60"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default PatientDashboard;
