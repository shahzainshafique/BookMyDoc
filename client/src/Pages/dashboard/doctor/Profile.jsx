import React from "react";
import DocHeader from "../../../Components/dashboard/doctor/common/DocHeader";
import DocSidebar from "../../../Components/dashboard/doctor/common/DocSidebar";

const Profile = () => {
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
                  src="https://randomuser.me/api/portraits/med/men/75.jpg"
                  alt="avatar"
                  className="h-20 w-20 rounded-full"
                />
                {/* Buttons to change and delete the image */}
                <div className="flex space-x-7">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Change Image
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
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
