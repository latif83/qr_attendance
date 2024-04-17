"use client";
import {
  faCaretRight,
  faSignOut,
  faSpinner,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Instructors() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [fetchData, setFetchData] = useState(true);
  
  const [instructor,setInstructor] = useState({})

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/courses/instructor");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setLoading(false);

        setCourses(responseData.Courses);
        // console.log(responseData.Courses);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    const getInstructor = async () => {
      try {

        const response = await fetch("/api/instructors/instructor");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }


        setInstructor(responseData.Instructor);
        // console.log(responseData.Instructor);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    if (fetchData) {
      getCourses();
      getInstructor()
      setFetchData(false);
    }
  }, [fetchData]);

  return (
    <div className="bg-green-700 h-screen">
      <div className="pb-12 py-3 bg-gray-50 relative">
        <div className="flex container mx-auto justify-between">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-lg"
              width={30}
              height={30}
            />
            <h2> {instructor.fname} {instructor.lname} </h2>
          </div>

          <div>
            <button className="bg-red-700 text-white hover:bg-red-500 p-2 rounded flex gap-2 items-center">
              <FontAwesomeIcon
                icon={faSignOut}
                className="text-lg"
                width={20}
                height={20}
              />
              Log out
            </button>
          </div>
        </div>

        <div className="my-5">
          <h1 className="text-center font-bold text-xl">
            INSTRUCTORS DASHBOARD
          </h1>
        </div>

        <div className="absolute left-0 w-full" style={{ bottom: -20 }}>
          <div className="container mx-auto">
          <span className="bg-gray-50 p-4 border border-3 border-green-700 rounded font-bold">
            Assigned Courses
          </span>
          </div>
        </div>
      </div>

      <div className="mt-12 container mx-auto">
        {loading ? (
          <p className="text-white text-center">
            <FontAwesomeIcon icon={faSpinner} spin /> Loading...
          </p>
        ) : courses.length < 1 ? (
          <p className="text-white text-center"> No Courses Assigned </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3 pt-5">
            {courses.map((course) => (
              <div className="bg-gray-50 border border-3 shadow-lg rounded p-3">
                <h1 className="font-bold text-xl">{course.code}</h1>
                <p>{course.title}</p>
                <Link href={`/instructors/course/${course.id}`} className="bg-green-400 hover:bg-green-500 mt-3 text-black flex gap-1 p-2 rounded items-center" style={{width:'max-content'}}>
                  Attendance{" "}
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className="text-lg"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
