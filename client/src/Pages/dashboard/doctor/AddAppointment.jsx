import Field from "../../../Components/common/Field";
import DocHeader from "../../../Components/dashboard/doctor/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/DocSidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useDocCall from "../../../Hooks/useDocCall";
import { useSelector } from "react-redux";
import Modal from "../../../Components/common/Modal";
import { useState } from "react";

const schema = yup.object().shape({
  patientName: yup.string().required("Patient Name is required"),
  appointmentDate: yup.date().required("Appointment date is required"),
  appointmentTime: yup.string().required("Appointment time is required"),
  appointmentLocation: yup
    .string()
    .required("Appointment location is required"),
});

const patientSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phone: yup.number().required("Phone number is required!"),
  email: yup.string().email(),
});

const AddAppointment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");  // To hold the patient ID value (patient's name initially)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const {
    register: registerPatient,
    handleSubmit: handleSubmitPatient,
    formState: { errors: patientErrors },
  } = useForm({
    resolver: yupResolver(patientSchema),
  });
  const currentUser = useSelector((state) => state.auth.userId);
  const { createAppointment } = useDocCall();

  const onSubmit = async (data) => {
    console.log(currentUser);
    data.doctorId = currentUser;
    console.log(data);
    const appointmentData = await createAppointment(data);
    console.log(appointmentData);
  };

  const handleAddPatient = async (data) => {
    try {
      // Add patient logic
      console.log("Patient Added:", data);
      setPatientName(data.firstName + " " + data.LastName);  // Set the patient ID to the patient's name

      setIsModalOpen(false); 
    } catch (error) {
      console.log("Error adding patient:", error);
    }
  };

  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        <DocSidebar />
        <section className="flex flex-col bg-gray-100 rounded-3xl m-5 p-5 space-y-7 w-3/5">
          Add Appointment below
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl w-3/5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-row items-center justify-center">
                <Field
                  label="Patient Name"
                  placeholder="Enter Patient Name"
                  type="text"
                  regVal="patientName"
                  register={register}
                  value={patientName}
                  errors={errors}
                />
                <button
                  title="Add New"
                  className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                  onClick={() => setIsModalOpen(true)}
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient">
  <form onSubmit={handleSubmitPatient(handleAddPatient)} className="space-y-4">
    <div>
      <label className="block mb-2">First Name:</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Enter first name"
        {...registerPatient("firstName")}
      />
      {patientErrors.firstName && (
        <span className="text-red-500">{patientErrors.firstName.message}</span>
      )}
    </div>
    <div>
      <label className="block mb-2">Last Name:</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Enter last name"
        {...registerPatient("lastName")}
      />
      {patientErrors.lastName && (
        <span className="text-red-500">{patientErrors.lastName.message}</span>
      )}
    </div>
    <div>
      <label className="block mb-2">Email:</label>
      <input
        type="email"
        className="w-full p-2 border rounded"
        placeholder="Enter email"
        {...registerPatient("email")}
      />
      {patientErrors.email && (
        <span className="text-red-500">{patientErrors.email.message}</span>
      )}
    </div>
    <div>
      <label className="block mb-2">Phone:</label>
      <input
        type="tel"
        className="w-full p-2 border rounded"
        placeholder="Enter phone number"
        {...registerPatient("phone")}
      />
      {patientErrors.phone && (
        <span className="text-red-500">{patientErrors.phone.message}</span>
      )}
    </div>
    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Add Patient
    </button>
  </form>
</Modal>

      </div>
    </>
  );
};

export default AddAppointment;