import axios from "axios";
import { useSelector } from "react-redux";

const usePatientCall = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { token } = useSelector((state) => state.auth);

  const authHeaders = { headers: { Authorization: token } };

  // Browse doctors, optionally filtered by a search string.
  const getDoctors = async (search = "") => {
    try {
      const { data } = await axios.get(
        `${url}/api/patient/doctors${search ? `?search=${encodeURIComponent(search)}` : ""}`,
        authHeaders
      );
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Book an appointment. The backend books for the authenticated patient.
  const bookAppointment = async (body) => {
    try {
      const { data } = await axios.post(
        `${url}/api/patient/book-appointment`,
        body,
        authHeaders
      );
      return data;
    } catch (error) {
      console.log(error);
      return { error: error?.response?.data?.error || "Booking failed" };
    }
  };

  const getMyAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${url}/api/patient/get-appointments`,
        authHeaders
      );
      return data;
    } catch (error) {
      console.log(error);
      return { appointments: [] };
    }
  };

  const cancelAppointment = async (body) => {
    try {
      const { data } = await axios.post(
        `${url}/api/patient/cancel-appointment`,
        body,
        authHeaders
      );
      return data;
    } catch (error) {
      console.log(error);
      return { error: error?.response?.data?.error || "Cancellation failed" };
    }
  };

  const rescheduleAppointment = async (body) => {
    try {
      const { data } = await axios.post(
        `${url}/api/patient/update-appointment`,
        body,
        authHeaders
      );
      return data;
    } catch (error) {
      console.log(error);
      return { error: error?.response?.data?.error || "Reschedule failed" };
    }
  };

  return {
    getDoctors,
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    rescheduleAppointment,
  };
};

export default usePatientCall;
