import React, { useState } from "react";
import DocHeader from "../../../Components/dashboard/doctor/common/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/common/DocSidebar";
import { useSelector } from "react-redux";
import useDocCall from "../../../Hooks/useDocCall";

const Profile = () => {
  const [imagePreview, setImagePreview] = useState(
    "https://randomuser.me/api/portraits/med/men/75.jpg"
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const doctorId = useSelector((state) => state.auth.doctorId);
  const doctorImage = useSelector((state) => state.auth.doctorProfileImage);

  const { updateDoctor } = useDocCall(); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleSubmit = async() => {
    if (!selectedFile) {
        alert("Please select an image first.");
        return;
      }
    
      try {
        const formData = new FormData();
        formData.append("doctorId", doctorId); // Add doctor ID
        formData.append("image", selectedFile); // Add image
        // formData.append("name", doctorName); // Add doctor's name
        // formData.append("email", doctorEmail); // Add email, etc.
    
        const updateResponse = await updateDoctor(formData);
        console.log("Profile updated successfully:", updateResponse);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
  };

  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        <DocSidebar />
        <div className="flex flex-col bg-gray-100 rounded-3xl m-5 p-5 space-y-7 w-3/5">
          <div className="flex flex-col space-y-4">
            <h1 className="font-semibold text-2xl">Profile</h1>
            <div className="flex flex-row items-center justify-evenly p-6 rounded-2xl bg-white space-x-5">
              <div className="flex flex-row items-center space-x-4">
                <img
                  src={imagePreview}
                  alt="avatar"
                  className="h-20 w-20 rounded-full"
                />
                <div className="flex space-x-7">
                  <label
                    htmlFor="fileInput"
                    className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Change Image
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setImagePreview(
                        "https://randomuser.me/api/portraits/med/men/75.jpg"
                      );
                      setSelectedFile(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
