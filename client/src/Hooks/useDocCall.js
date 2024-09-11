import axios from "axios";
import { useSelector } from "react-redux";

const useDocCall = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { token } = useSelector((state) => state.auth);

  const getTodayAppointments = async (doctorId) => {
    try {
      const { data } = await axios.get(
        `${url}/api/doctor/appointments/${doctorId}`,
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
  return { getTodayAppointments };
};

export default useDocCall;
