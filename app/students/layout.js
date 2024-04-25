"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminSidebar } from "./sidebar";
import { faBarsStaggered, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import { toast } from "react-toastify";

export default function StudentsRootLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((state) => !state);
  };

  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const [data,setData] = useState({})

  useEffect(() => {

    const width = window.innerWidth;

    if (width < 965) {
      setShowSidebar(false);
    }

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
    <div className="flex h-screen overflow-hidden">
      <div
        style={{ width: "20%" }}
        className={`h-full ${!showSidebar && "hidden"} ${
          styles.sidebarContainer
        }`}
      >
        <AdminSidebar setShowSidebar={setShowSidebar} />
      </div>
      <div
        style={{ width: "100%", height: "100%" }}
        className={`h-full border-2 ${styles.mainContainer} flex flex-col`}
      >
        <div
          style={{ height: "10%" }}
          className="bg-green-700 shadow p-3 flex justify-between items-center text-gray-100"
        >
          <div>
            <FontAwesomeIcon
              onClick={toggleSidebar}
              icon={faBarsStaggered}
              className="text-lg cursor-pointer text-gray-100 hover:text-gray-300"
              width={20}
              height={20}
            />
          </div>
          <div>
            <h1>Good Morning,</h1>
            <p>{loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                data?.fname
              )}</p>
          </div>
        </div>
        <div style={{height:"90%"}} className="p-3 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
