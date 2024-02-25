import "./css/auth.css";
import RegisterDoctorForm from "../../Components/authForm/RegisterDoctorForm";
import image from "../../Assets/register.png";
import Header from "../../Components/header/Header";

const RegisterDoctor = () => {
  return (
    <>
      <div className="h-[100vh] md:h-[90vh] grid grid-rows-7 md:grid-cols-2 register-page">
        <div className="row-span-5 md:grid-cols-1 mt-3">
          <RegisterDoctorForm />
        </div>
      </div>
    </>
  );
};

export default RegisterDoctor;
