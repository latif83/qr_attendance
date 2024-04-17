"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Students(){

      // State to hold the current time
  const [currentTime, setCurrentTime] = useState("");

  // Function to update the current time
  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setCurrentTime(formattedTime);
  };

  // useEffect hook to update the time initially and start the interval
  useEffect(() => {
    updateTime(); // Update the time initially
    // Set up interval to update time every second (1000ms)
    const interval = setInterval(updateTime, 1000);
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);


    return (
        <div>

<div className="border-b pb-3 flex sm:flex-row flex-col justify-between items-center">
        <h1 className="font-bold text-xl">Students Dashboard</h1>
        <div>
          {/* Display the current time */}
          <p>{currentTime}</p>
        </div>
      </div>

<div className="mt-5">
<div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-xs text-red-500">First Name: </h3>
            <p>
              {/* {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.fname
              )} */}
              Daniel
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Last Name: </h3>
            <p>
              {/* {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.lname
              )} */}
              Osie
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Student Id.: </h3>
            <p>
              {/* {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.staffid
              )} */}
              BSC/CSM/20222187
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Level: </h3>
            <p>
              {/* {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.department?.name
              )} */}
              300
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Address: </h3>
            <p>
              {/* {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.address
              )} */}
              Pokuase
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Contact: </h3>
            <p>
              {/* {empLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                employeeInfo?.address
              )} */}
              0244893848
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-3">
          <button
            // onClick={() => setEditProfile(true)}
            className="bg-green-600 hover:bg-green-800 text-white rounded-lg p-2 text-xs"
          >
            Edit Profile
          </button>
        </div>
</div>

<div className="border-b">
          <h1>Things to do</h1>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-5">
          <Link
            href="/employee/attendance"
            className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50"
          >
            Clock in / out
          </Link>

          <div className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50">
            View Attendance History
          </div>

          <div className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50">
            Register Courses
          </div>

          {/* <div className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50">
            Book Apointment
          </div>

          <div className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50">
            View Apointment History
          </div> */}
        </div>
           
        </div>
    )
}