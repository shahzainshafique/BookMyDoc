import axios from "axios";

import {
  fetchFail,
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../Features/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const url = import.meta.env.VITE_BACKEND_URL;

const useAuthCall = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const regDoctor = async (userData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${url}/api/doctor/signup`, userData);
      console.log(data);
      if (!data.error) {
        dispatch(registerSuccess(data));
        navigate("/doctor");
      }
    } catch (error) {
      alert(error.response.data.error);
      dispatch(fetchFail());
      console.log(error);
    }
  };
  const loginDoctor = async (userData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${url}/api/doctor/login`, userData);
      log(data);
      if (!data.error) {
        dispatch(loginSuccess(data));
        navigate("/doctor");
      }
      return data;
    } catch (error) {
      alert(error.response.data.error);
      dispatch(fetchFail());
    }
  };
  const reqOTP = async (userData) => {
    console.log(userData);
    dispatch(fetchStart());
    try {
      const { data } = await axios.post(`${url}/api/otp/request-otp`, userData);
      console.log(data);
      return data;
    } catch (error) {
      console.log("eer", error);
      alert(error.response.data.error);
      dispatch(fetchFail());
    }
  };

  const verifyOtp = async (otpData) => {
    try {
      console.log(otpData);
      const { data, status } = await axios.post(
        `${url}/api/otp/verify-otp`,
        otpData
      );
      console.log(data);
      alert(data.message);
    } catch (error) {
      console.log("eer", error);
      alert(error.response.data.error);
    }
  };
  return {
    regDoctor,
    loginDoctor,
    reqOTP,
    verifyOtp,
  };
};

export default useAuthCall;
