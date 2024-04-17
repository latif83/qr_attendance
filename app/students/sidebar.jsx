"use client";
import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";

export const AdminSidebar = ({ setShowSidebar }) => {
  const pathname = usePathname();

  const toggleSidebar = () => {
    const width = window.innerWidth;
    if (width < 965) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="bg-green-700 border-2 h-full w-full p-2">
      <div className="flex w-full overflow-hidden items-center flex-col justify-center mt-3 font-semibold text-gray-700 gap-2">
        <img
          class="w-10 h-10 mr-2 p-2 bg-white rounded-full"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        <span className={`${styles.marquee} text-gray-200`}>
        Student Attendance System Using QR-Code
        </span>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname == "/students" && "bg-gray-200"
          }`}
          href="/students"
          onClick={toggleSidebar}
        >
          Dashboard
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("attendance") && "bg-gray-200"
          }`}
          href="/students/attendance"
          onClick={toggleSidebar}
        >
          Register Courses
        </Link>
        <Link
          className={`p-2 rounded-lg hover:font-semibold ${
            pathname.includes("attendance") && "bg-gray-200"
          }`}
          href="/students/attendance"
          onClick={toggleSidebar}
        >
          Attendance
        </Link>
       
      </div>
    </div>
  );
};
