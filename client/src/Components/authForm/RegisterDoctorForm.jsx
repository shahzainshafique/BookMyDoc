import { useState } from "react";

import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import useAuthcall from "../../Hooks/useAuthCall";
import doctor from "../../assets/doctor.png";

export const registerSchema = object().shape({
  firstname: string()
    .max(20, "Maximum 20 characters!")
    .required("Firstname is required!"),
  email: string().email().required("Email is required!"),
  password: string()
    .required("Password is required")
    .min(8, "Minium 8 characters are required!")
    .max(20, "Maximum limit is 20 characters!")
    .matches(/\d+/, "Minimum 1 digit is required")
    .matches(/[a-z]/, "Minimum 1 lowercase letter is required!")
    .matches(/[A-Z]/, "Minimum 1 Uppercase letter is required!")
    .matches(/[!,?{}><%&$#£+-.]+/, "Minimum 1 Symbol is required!"),

  street: string().required("Street is required!"),
  zipCode: string().required("ZipCode is required"),
  branch: string().required("Branch is required"),
});

const RegisterDoctorForm = () => {
  const { regDoctor } = useAuthcall();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver });

  const onSubmit = (data) => {
    console.log(data);
    regDoctor(data);
  };

  const [isPasswordHidden, setPasswordHidden] = useState(true);
  const [isCalendarHidden, setCalendarHidden] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (selectedDate) => {
    setSelectedDate(selectedDate.toISOString().slice(0, 10));
  };

  const handleClose = (state) => {
    setShow(state);
  };
  return <div>RegisterDoctorForm to be continued...</div>;
};

export default RegisterDoctorForm;
