import axios from "axios";
import { useSelector } from "react-redux";

const useDocCall = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { token } = useSelector((state) => state.auth);

  const getTodayAppointments = async (doctorId) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      console.log(today);
      const { data } = await axios.get(
        `${url}/api/doctor/appointments/${doctorId}?date=${today}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const cancelAppointment = async (body) => {
    try {
      console.log("t", token);
      const { data } = await axios.post(
        `${url}/api/doctor/cancel-appointment`,
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const rescheduleAppointment = async (body) => {
    try {
      console.log("t", token);
      const { data } = await axios.post(
        `${url}/api/doctor/update-appointment`,
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  return { getTodayAppointments, cancelAppointment, rescheduleAppointment };
};

export default useDocCall;
