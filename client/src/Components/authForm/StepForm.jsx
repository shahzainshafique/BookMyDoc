import { useState } from "react";

import { object, string, number } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import StepCounter from "./StepCounter";
import Field from "../common/Field";
import { fields } from "../../Constants/data";

const StepForm = () => {
  const [formStep, setFormStep] = useState(1);

  const stepOneScehma = object().shape({
    firstname: string()
      .max(20, "Maximum 20 characters!")
      .required("First Name is required!"),
    lastname: string()
      .max(20, "Maximum 20 characters!")
      .required("Last Name is required!"),
    email: string().email().required("Email is required!"),
    workingDays: string().required("Working Days are required!"),
    phone: number().required("Phone number is required!"),
    specialization: string().required("Specialization is required!"),
    clinic: string().required("Clinic is required!"),
  });
  const stepTwoScehma = object().shape({
   
    email: string().email().required("Email is required!"),
    password: string().required().min(8,"Password should be of minimum 8 characters")
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: (step)=>{ if(step==1) return yupResolver;
    if(step==2) return yupResolver; },
  });

  const renderFields = (step) => {
    return fields.map((field, index) => {
      if (field.step === step) {
        return (
          <Field
            key={index}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            regVal={field.name}
            register={register}
            errors={errors}
          />
        );
      }
    });
  };
  
  

  const handleNextStep = () => {
    setFormStep((prevStep) => prevStep + 1);
    
  };

  const handlePreviousStep = () => {
    setFormStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };
  return (
    <section className="bg-gray-50">
      <div className="flex space-y-4 flex-col items-center my-5 px-6 py-8 mx-auto md:h-screen lg:py-0">
        <StepCounter currentStep={formStep} setFormStep={setFormStep} />

        <div className="w-full flex-row space-x-9 bg-white rounded-lg shadow light:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-800 light:border-gray-700">
          <div className="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl light:text-white">
              {formStep === 1
                ? "Please enter personal details"
                : formStep === 2
                ? "Please enter additional details"
                : "Please review the details"}
            </h1>
            <form
              className="space-y-4 md:space-y-6 flex flex-col items-center justify-center"
              onSubmit={handleSubmit(handleNextStep)}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                {formStep === 1 && renderFields(1)}
                {formStep === 2 && renderFields(2)}
                {formStep === 3 && renderFields(3)}
              </div>

              <div className="flex justify-between w-full">
                {formStep > 1 && formStep < 3 && (
                  <button
                    type="submit"
                    onClick={handlePreviousStep}
                    className="w-full text-black border border-black mx-5 bg-white hover:bg-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                  >
                    Previous
                  </button>
                )}

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center light:bg-primary-600 light:hover:bg-primary-700 light:focus:ring-primary-800"
                >
                  {formStep === 3 ? "Submit" : "Save and Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepForm;
