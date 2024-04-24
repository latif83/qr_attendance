"use client"
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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


  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const [data,setData] = useState({})

  useEffect(() => {
    const getStudentData = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/students/student");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setLoading(false);

        setData(responseData.student);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    if (fetchData) {
      getStudentData();
      setFetchData(false);
    }
  }, [fetchData]);

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
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                data?.fname
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Last Name: </h3>
            <p>
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                data?.lname
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Student Id.: </h3>
            <p>
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                data?.studid
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Level: </h3>
            <p>
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                data?.level
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Address: </h3>
            <p>
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                data?.address
              )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xs text-red-500">Contact: </h3>
            <p>
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                data?.contact
              )}
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
            href="/students/attendance"
            className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50"
          >
            Clock in / out
          </Link>

          <Link href="/students/attendance" className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50">
            View Attendance History
          </Link>

          <Link href="/students/register" className="shadow-lg p-3 rounded-lg bg-green-200 cursor-pointer hover:bg-green-50">
            Register Courses
          </Link>


        </div>
           
        </div>
    )
}