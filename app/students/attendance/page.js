"use client"
import { faPause, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AttendanceHistory } from "./history";

export default function Attendance(){

      // State to hold the current time
  const [currentTime, setCurrentTime] = useState("");

  const [currentDate, setCurrentDate] = useState("");

  // Function to update the current time
  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setCurrentTime(formattedTime);
    const formattedDate = now.toDateString();
    setCurrentDate(formattedDate);
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
           <div className="flex flex-col justify-center items-center mt-3">
        <h1 className="text-4xl">{currentTime}</h1>
        <p>{currentDate}</p>
      </div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col items-center gap-2 justify-center">
          <button
            // onClick={() => setAuthenticate(true)}
            className="shadow-lg shadow-green-500/50 hover:bg-green-500 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center"
          >
            <FontAwesomeIcon icon={faSignIn} />
          </button>
          <span>Clock in</span>
        </div>

      </div>

      <div className="mt-5">
        <AttendanceHistory />
      </div>
        </div>
    )
}