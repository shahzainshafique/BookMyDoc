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
      if(!data.error){
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
  return {
    regDoctor,
    loginDoctor,
  };
};

export default useAuthCall;
