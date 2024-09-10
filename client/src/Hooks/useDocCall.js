import axios from "axios";
import { useSelector } from "react-redux";

const useDocCall = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { token } = useSelector((state) => state.auth);

  const getTodayAppointments = async (doctorId) => {
    try {
      console.log("dasd", doctorId);
      console.log("to", token);
      const { data } = await axios.get(
        `${url}/api/doctor/appointments/${doctorId}`,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  return { getTodayAppointments };
};

export default useDocCall;
