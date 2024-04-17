"use client";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styles from "./registerCourse.module.css";
import { toast } from "react-toastify";

export const RegisterCourse = ({ setRegCourse }) => {
  const [loading, setLoading] = useState(false);

  const [cousesLoading, setCoursesLoading] = useState(false);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setCoursesLoading(true);

        const response = await fetch("/api/courses");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setCoursesLoading(false);

        setCourses(responseData.Courses);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    getCourses();
  }, []);

  const submit = () => {};

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Register Courses</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setRegCourse(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <form action={submit}>
          <div className="relative z-0 w-full group mb-5">
            <label
              htmlFor="course"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Select Course
            </label>
            <select
              id="course"
              name="course"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              required
            >
              <option value="">Select Course</option>
              {cousesLoading ? (
                <option>
                  {" "}
                  <FontAwesomeIcon
                    icon={faSpinner}
                    color="red"
                    className="text-lg"
                    spin
                  />{" "}
                  Loading Courses...{" "}
                </option>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <option value={course.id}>{course.title}</option>
                ))
              ) : (
                <option>No courses found.</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 disabled:bg-green-200 hover:bg-green-600 text-white font-medium rounded py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />{" "}
                Register{" "}
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
