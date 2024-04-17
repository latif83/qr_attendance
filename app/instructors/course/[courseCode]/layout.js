"use client";
import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children, params }) {
  const pathname = usePathname();
  return (
    <div className="h-screen bg-gray-50">
      <div className="bg-green-700">
        <div className="container relative mx-auto py-3 pb-0">
          <div className="py-3 flex justify-between items-center">
            <div>
              <button className="p-2 rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-1">
                <FontAwesomeIcon
                  className="text-lg"
                  width={20}
                  height={20}
                  icon={faArrowRotateBack}
                />
                back
              </button>
            </div>

            <div className="text-gray-50">
              <h1 className="text-xl font-bold">IT-209</h1>
              <p>Data Assurance</p>
            </div>
          </div>

          <div className="text-white mt-5 font-medium">
            <div className="container mx-auto flex items-center gap-4">
              <Link
                className={`hover:font-bold ${
                  pathname == `/instructors/course/${params.courseCode}` &&
                  "bg-gray-50 p-2 rounded-t text-black"
                }`}
                href={`/instructors/course/${params.courseCode}`}
              >
                Dashboard
              </Link>
              <Link
                className={`hover:font-bold ${
                  pathname ==
                    `/instructors/course/${params.courseCode}/attendance` &&
                  "bg-gray-50 p-2 rounded-t text-black"
                }`}
                href={`/instructors/course/${params.courseCode}/attendance`}
              >
                Attendance
              </Link>
              <Link
                className={`hover:font-bold ${
                  pathname ==
                    `/instructors/course/${params.courseCode}/students` &&
                  "bg-gray-50 p-2 rounded-t text-black"
                }`}
                href={`/instructors/course/${params.courseCode}/students`}
              >
                Students
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="container py-5 mx-auto">{children}</div>
      </div>
    </div>
  );
}
