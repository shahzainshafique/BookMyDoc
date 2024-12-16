import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Components
import Field from "../../../Components/common/Field";
import DocHeader from "../../../Components/dashboard/doctor/common/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/common/DocSidebar";
import useDocCall from "../../../Hooks/useDocCall";

const Profile = () => {
  const [imagePreview, setImagePreview] = useState(
    "https://randomuser.me/api/portraits/med/men/75.jpg"
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "Dr. John Doe",
    email: "dr.johndoe@example.com",
    specialization: "Cardiology",
  });

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

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("doctorId", doctorId); // Add doctor ID
      payload.append("image", selectedFile); // Add image
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]); // Add other form fields
      });

      const updateResponse = await updateDoctor(payload);
      console.log("Profile updated successfully:", updateResponse);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    if (doctorImage) {
      setImagePreview(doctorImage);
    }
  }, [doctorImage]);

  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        <DocSidebar />
        <div className="flex flex-col bg-gray-100 rounded-3xl m-5 p-5 space-y-7 w-3/5">
          <div className="flex flex-col space-y-4">
            <h1 className="font-semibold text-2xl">Profile</h1>
            <div className="flex flex-col items-center justify-evenly p-6 rounded-2xl bg-white space-x-5">
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
              {/* Dynamic Fields */}
              <Field
                label="Name"
                name="name"
                value={formData.name}
                placeholder="Enter your name"
                onChange={handleFieldChange}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleFieldChange}
              />
              <Field
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                placeholder="Enter your specialization"
                onChange={handleFieldChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
