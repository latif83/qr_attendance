"use client"
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddCourse } from "./addCourse";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Courses() {

    const [adCourse,setAddCourse] = useState(false)

    const [courses,setCourses] = useState([])

    const [loading, setLoading] = useState(false);
    const [fetchData, setFetchData] = useState(true);
  
    useEffect(() => {
      const getCourses = async () => {
        try {
          setLoading(true);
  
          const response = await fetch("/api/courses");
          const responseData = await response.json();
  
          if (!response.ok) {
            toast.error(responseData.error);
            return;
          }
  
          setLoading(false);
  
          setCourses(responseData.Courses);
        } catch (err) {
          console.log(err);
          toast.error("An unexpected error happended, Please try again later.");
        }
      };
  
      if (fetchData) {
        getCourses();
        setFetchData(false);
      }
    }, [fetchData]);

  return (
    <div>
        {adCourse && <AddCourse setAddCourse={setAddCourse} setFetchData={setFetchData} />}

      <h1>Courses</h1>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <div class="p-4 bg-gray-800 flex justify-between">
          <div>
            <label for="table-search" class="sr-only">
              Search
            </label>
            <div class="relative mt-1">
              <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                class="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-green-500 focus:border-green-500"
                placeholder="Search courses"
              />
            </div>
          </div>
          <div>
            <button
                onClick={() => setAddCourse(true)}
              className="p-2 rounded-lg bg-gray-50 flex gap-2 items-center hover:bg-gray-200 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Course
            </button>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">
                Course Code
              </th>
              <th scope="col" class="px-6 py-3">
                Title
              </th>
              <th scope="col" class="px-6 py-3">
                Instructor
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
           
            {loading ? (
        <tr class="bg-white border-b hover:bg-gray-50">
          <td colSpan={4} class="px-6 py-4 text-center">
            <FontAwesomeIcon icon={faSpinner} spin /> Loading...
          </td>
        </tr>
      ) : courses.length > 0 ? (
        courses.map((course) => (
          <tr class="bg-white border-b hover:bg-gray-50">
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
          >
            {course.code}
          </th>
          <td class="px-6 py-4">{course.title}</td>
          <td class="px-6 py-4">{course.instructor.fname} {course.instructor.lname}</td>
          <td class="px-6 py-4">
            <a href="#" class="font-medium text-green-600 hover:underline mr-2">
              Edit
            </a>
            <a href="#" class="font-medium text-red-600 hover:underline">
              Delete
            </a>
          </td>
        </tr>

        ))
      ) : (
        <tr class="bg-white border-b hover:bg-gray-50">
          <td colSpan={4} class="px-6 py-4 text-center">
            No courses found
          </td>
        </tr>
      )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
