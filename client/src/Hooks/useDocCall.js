import axios from "axios";
import { useSelector } from "react-redux";

const useDocCall = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const doctorId = useSelector((state) => state.auth.doctorId);
  const { token } = useSelector((state) => state.auth);
  const getTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      console.log(today);
      const { data } = await axios.get(
        `${url}/api/doctor/appointments/${doctorId}`,
        // `${url}/api/doctor/appointments/${doctorId}?date=${today}`,
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
  const createAppointment = async (body) => {
    try {
      const { data } = await axios.post(
        `${url}/api/doctor/appointments/create`,
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      );
     return data;
    } catch (error) {
      console.log(error);
    }
  };
  const addPatient = async (userData) => {
    try {
      const { data } = await axios.post(`${url}/api/doctor/appointments/create-patient`, userData, {
        headers: {
          Authorization: token,
        },
      });
      console.log(data);
      return data;
    } catch (error) {
      alert(error.response.data.error);
      console.log(error);
    }
  };
  const getPatients = async (doctorId) => {
    try {
      const { data } = await axios.get(`${url}/api/doctor/get-all-patients/${doctorId}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  const updateDoctor = async (docData) => {
    try {
      console.log("doctorId", doctorId);
      const { data } = await axios.post(
        `${url}/api/doctor/update-doctor-profile/${doctorId}`,
        docData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      throw error;
    }
  }
  return { getTodayAppointments, cancelAppointment, rescheduleAppointment, createAppointment, addPatient,getPatients, updateDoctor  };
};



export default useDocCall;
