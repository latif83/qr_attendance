"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminSidebar, EmployeeSidebar } from "./sidebar";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from './layout.module.css'

export default function RootLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((state) => !state);
  };

  useEffect(() => {
    const width = window.innerWidth;

    if (width < 965) {
      setShowSidebar(false);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        style={{ width: "20%" }}
        className={`h-full ${!showSidebar && "hidden"} ${styles.sidebarContainer}`}
      >
        <AdminSidebar setShowSidebar={setShowSidebar} />
      </div>
      <div style={{ width: "100%" }} className={`h-full border-2 ${styles.mainContainer}`}>
        <div className="bg-green-700 shadow p-3 flex justify-between items-center text-gray-100">
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
            <p>Daniel Osie</p>
          </div>
        </div>
        <div className="p-3">
        {children}
            </div>
      </div>
    </div>
  );
}
