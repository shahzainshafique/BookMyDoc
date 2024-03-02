import StepCounter from "./StepCounter";
import Field from "../common/Field";

const StepForm = () => {
  const fields = [
    { label: "First Name", placeholder: "", column: 1 },
    { label: "Email Address", placeholder: "name@email.com", column: 1 },
    { label: "Phone Number", placeholder: "+92 3149552548", column: 1 },
    { label: "Working Days", placeholder: "", type: "date", column: 1 },

    { label: "Last Name", placeholder: "", column: 2 },
    { label: "Specialization", placeholder: "ENT, General", column: 2 },
    { label: "Clinic", placeholder: "Agha Khan Hospital", column: 2 },
    { label: "Working Hours", placeholder: "", type: "time", column: 2 },
  ];
  const renderFields = (column) => {
    return fields.map((field, index) => {
      if (field.column == column) {
        return (
          <Field
            key={index}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
          />
        );
      }
    });
  };
  return (
    <section class="bg-gray-50">
      <div class="flex space-y-4 flex-col items-center my-5 px-6 py-8 mx-auto md:h-screen lg:py-0">
        <StepCounter />

        <div class="w-full flex-row space-x-9  bg-white rounded-lg shadow light:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-800 light:border-gray-700">
          <div class="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl light:text-white">
              Please enter personal details
            </h1>
            <form
              class="space-y-4 md:space-y-6 flex flex-col items-center justify-center"
              action="#"
            >
              <div className="flex flex-row space-x-11">
                <div className="flex flex-col space-y-5 items-center xl:flex-col xl:justify-between w-full">
                  {renderFields(1)}
                </div>
                <div className="flex flex-col items-center xl:flex-col xl:justify-between w-full">
                  {renderFields(2)}
                </div>
              </div>

              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center light:bg-primary-600 light:hover:bg-primary-700 light:focus:ring-primary-800"
              >
                Save and Next
              </button>
              <p class="text-sm font-light text-gray-500 light:text-gray-400">
                Already have an account?{" "}
                <a
                  href="#"
                  class="font-medium text-primary-600 hover:underline light:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepForm;
