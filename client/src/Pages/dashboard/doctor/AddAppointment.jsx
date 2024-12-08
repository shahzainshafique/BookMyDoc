import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";

// Components
import Field from "../../../Components/common/Field";
import DocHeader from "../../../Components/dashboard/doctor/common/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/common/DocSidebar";
import Modal from "../../../Components/common/Modal";

// Hooks
import useDocCall from "../../../Hooks/useDocCall";

// Validation Schemas
const appointmentSchema = yup.object().shape({
  patientName: yup.string().required("Patient Name is required"),
  appointmentDate: yup.date().required("Appointment date is required"),
  appointmentTime: yup.string().required("Appointment time is required"),
  appointmentLocation: yup
    .string()
    .required("Appointment location is required"),
});

const patientSchema = yup.object().shape({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  phonenumber: yup
    .string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email format").optional(),
});

const AddAppointment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // To track matching suggestions
  // Appointment form hooks
  const {
    register,
    handleSubmit,
    setValue, // Added setValue to programmatically set form values
    reset: resetAppointment,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentSchema),
  });

  // Patient form hooks
  const {
    register: registerPatient,
    handleSubmit: handleSubmitPatient,
    reset: resetPatient,
    formState: { errors: patientErrors },
  } = useForm({
    resolver: yupResolver(patientSchema),
  });

  const currentUser = useSelector((state) => state.auth.doctorId);
  const { createAppointment, addPatient, getPatients } = useDocCall();
  //Load patients
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patients = await getPatients(currentUser);
        console.log("patients:", patients);
        setPatients(patients);
      } catch (error) {
        console.error("Error loading patients:", error);
      }
    };
    loadPatients();
  }, []);

  const onSubmitPatient = useCallback(
    async (data) => {
      try {
        console.log("Patient data:", data);
        if (!data.email) {
          delete data.email;
          data.isGuest = true;
        }
        const newPatient = await addPatient(data);
        console.log("New patient:", newPatient);

        if (!newPatient.error) {
          toast.success("Patient Added!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
        const fullName = `${data.firstname} ${data.lastname}`;

        // Set patient name in both state and form value
        setPatientName(fullName);
        setValue("patientName", fullName);
        setPatientId(newPatient._id);
        setIsModalOpen(false);
        resetPatient(); // Reset patient form
      } catch (error) {
        console.error("Error adding patient:", error);
        // Consider adding user-friendly error handling
      }
    },
    [resetPatient, setValue]
  );

  const onSubmitAppointment = useCallback(
    async (data) => {
      try {
        data.doctorId = currentUser;
        data.patientId = patientId;
        console.log("Appointment data:", data);
        const appointmentData = await createAppointment(data);
        toast.success("Appointment Created!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        console.log("Appointment created:", appointmentData);
        resetAppointment(); // Reset form after successful submission
        setPatientName("");
      } catch (error) {
        console.error("Error creating appointment:", error);
        // Consider adding user-friendly error handling
      }
    },
    [currentUser, createAppointment, resetAppointment]
  );

  // Modal toggle handlers
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const handleInputChange = (e) => {
    console.log("e:", e.target.value);

    const value = e.target.value;
    setPatientName(value);
    console.log("value:", value);
    console.log("patients:", patients);
    // Filter suggestions
    if (value) {
      const filtered = patients.filter((patient) => {
        const fullName =
          `${patient.firstname} ${patient.lastname}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (patient) => {
    setValue("patientName", `${patient.firstname} ${patient.lastname}`);
    setPatientId(patient._id);
    setSuggestions([]); // Clear suggestions after selecting
  };
  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        <DocSidebar />
        <section className="flex flex-col bg-gray-100 rounded-3xl m-5 p-5 space-y-7 w-3/5">
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl w-3/5">
            <form
              onSubmit={handleSubmit(onSubmitAppointment)}
              className="space-y-4"
            >
              <div className="flex flex-row items-center justify-center">
                <Field
                  label="Patient Name"
                  placeholder="Enter Patient Name"
                  type="text"
                  regVal="patientName"
                  register={register}
                  value={patientName}
                  errors={errors}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  title="Add New Patient"
                  className="group cursor-pointer outline-none hover:rotate-90 duration-300 ml-2"
                  onClick={openModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    className="self-center stroke-blue-400 fill-none group-hover:fill-blue-600 group-active:stroke-blue-200 group-active:fill-white group-active:duration-0 duration-300"
                  >
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"></path>
                    <path d="M8 12H16"></path>
                    <path d="M12 16V8"></path>
                  </svg>
                </button>
              </div>
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-1/5 mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                  {suggestions.map((patient) => (
                    <li
                      key={patient._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 
                   active:bg-blue-100 focus:outline-none focus:bg-blue-50"
                      onClick={() => handleSuggestionClick(patient)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800">
                          {`${patient.firstname} ${patient.lastname}`}
                        </span>
                        {patient.additionalInfo && (
                          <span className="text-xs text-gray-500">
                            {patient.additionalInfo}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Field
                label="Appointment Date"
                placeholder="Select appointment date"
                type="date"
                regVal="appointmentDate"
                register={register}
                errors={errors}
              />
              <Field
                label="Appointment Time"
                placeholder="Select appointment time"
                type="time"
                regVal="appointmentTime"
                register={register}
                errors={errors}
              />
              <Field
                label="Appointment Location"
                placeholder="Enter appointment location"
                type="text"
                regVal="appointmentLocation"
                register={register}
                errors={errors}
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </section>

        {/* Modal remains the same */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Add New Patient"
        >
          <form
            onSubmit={handleSubmitPatient(onSubmitPatient)}
            className="space-y-4"
          >
            {/* Form fields remain the same */}
            <div>
              <label className="block mb-2">First Name:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter first name"
                {...registerPatient("firstname")}
              />
              {patientErrors.firstname && (
                <span className="text-red-500">
                  {patientErrors.firstname.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2">Last Name:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter last name"
                {...registerPatient("lastname")}
              />
              {patientErrors.lastname && (
                <span className="text-red-500">
                  {patientErrors.lastname.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2">Email (Optional):</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                placeholder="Enter email"
                {...registerPatient("email")}
              />
              {patientErrors.email && (
                <span className="text-red-500">
                  {patientErrors.email.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2">Phone:</label>
              <input
                type="tel"
                className="w-full p-2 border rounded"
                placeholder="Enter 11-digit phone number"
                {...registerPatient("phonenumber")}
              />
              {patientErrors.phonenumber && (
                <span className="text-red-500">
                  {patientErrors.phonenumber.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Patient
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AddAppointment;
