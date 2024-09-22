import Field from "../../../Components/common/Field";
import DocHeader from "../../../Components/dashboard/doctor/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/DocSidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object().shape({
  patientId: yup.string().required("Patient ID is required"),
  doctorId: yup.string().required("Doctor ID is required"),
  appointmentDate: yup.date().required("Appointment date is required"),
  appointmentTime: yup.string().required("Appointment time is required"),
  appointmentLocation: yup
    .string()
    .required("Appointment location is required"),
});
const AddAppointment = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send the data to your API
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
              <div className="flex flex-row">
                <Field
                  label="Patient ID"
                  placeholder="Enter patient ID"
                  type="text"
                  regVal="patientId"
                  register={register}
                  errors={errors}
                />
                <button
                  title="Add New"
                  className="group cursor-pointer outline-none hover:rotate-90 duration-300"
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
                label="Doctor ID"
                placeholder="Enter doctor ID"
                type="text"
                regVal="doctorId"
                register={register}
                errors={errors}
              />
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
      </div>
    </>
  );
};

export default AddAppointment;
