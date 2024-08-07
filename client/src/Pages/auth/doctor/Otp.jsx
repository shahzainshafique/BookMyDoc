import React, { useRef, useState } from "react";

const Otp = () => {
  const otpInputs = Array(4)
    .fill(null)
    .map(() => useRef(null));

  const [disabledField, setDisabledField] = useState(false);
  const focusInput = (inputs, index) => {
    inputs[index].current.focus();
  };
  const handleInputChange = (inputs, index, value) => {
    if (value && index < inputs.length - 1) {
      focusInput(inputs, index + 1);
    }
    const allValuesPresent = inputs.every(
      (input) => input.current && input.current.value !== ""
    );
    if (index == inputs.length - 1 && allValuesPresent) {
      const otpValue = inputs.map((input) => input.current.value).join("");
      setTimeout(() => {
        setDisabledField(true);
      }, 1000);
    }
  };

  const handleKeyDown = (inputs, index, e) => {
    if (e.key == "ArrowLeft" && index > 0) {
      focusInput(inputs, index - 1);
    } else if (e.key == "ArrowRight" && index < inputs.length - 1) {
      focusInput(inputs, index + 1);
    }

    if (e.key == "Backspace" && index > 0) {
      e.preventDefault();
      inputs[index].current.value = "";
      focusInput(inputs, index - 1);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your email.
          </p>
        </header>
        <form id="otp-form">
          <div className="flex items-center justify-center gap-3">
            {otpInputs.map((inputsRef, index) => (
              <input
                key={index}
                ref={inputsRef}
                disabled={disabledField}
                type="text"
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                maxLength="1"
                onChange={(e) =>
                  handleInputChange(otpInputs, index, e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(otpInputs, index, e)}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-primary-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            >
              Verify Account
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-500 mt-4">
          Didn't receive code?{" "}
          <a
            className="font-medium text-indigo-500 hover:text-indigo-600"
            href="#0"
          >
            Resend
          </a>
        </div>
      </div>
    </div>
  );
};

export default Otp;
