"use client";
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { AddCourse } from "./addCourse";
import { useEffect, useState } from "react";
import { AddInstructor } from "./addInstructor";
import { EditInstructor } from "./editInstructor";

export default function Instructors() {
  const [addInstructor, setAddInstructor] = useState(false);
  const [editInstructor,setEditInstructor] = useState(false)
  const [instructorData,setInstructorData] = useState()

  const [instructors, setInstructors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(true);

  useEffect(() => {
    const getInstructors = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/instructors");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setLoading(false);

        setInstructors(responseData.Instructors);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    if (fetchData) {
      getInstructors();
      setFetchData(false);
    }
  }, [fetchData]);

  return (
    <div>
      {addInstructor && (
        <AddInstructor
          setAddInstructor={setAddInstructor}
          setFetchData={setFetchData}
        />
      )}

{editInstructor && (
        <EditInstructor
        setEditInstructor={setEditInstructor}
          setFetchData={setFetchData}
          instructorData={instructorData}
        />
      )}

      <h1>Instructors</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <div className="p-4 bg-gray-800 flex justify-between">
          <div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
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
                className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-green-500 focus:border-green-500"
                placeholder="Search instructors"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => setAddInstructor(true)}
              className="p-2 rounded-lg bg-gray-50 flex gap-2 items-center hover:bg-gray-200 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Instructor
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Staff id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Courses
              </th>
              <th scope="col" className="px-6 py-3">
                Contact
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="bg-white border-b hover:bg-gray-50">
                <td colSpan={6} className="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : instructors.length > 0 ? (
              instructors.map((instructor) => (
                <tr className="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {instructor.staffid}
                  </th>
                  <td className="px-6 py-4">
                    {instructor.fname} {instructor.lname}
                  </td>
                  <td className="px-6 py-4"> {instructor.courseCount}</td>
                  <td className="px-6 py-4">{instructor.contact}</td>
                  <td className="px-6 py-4">{instructor.address}</td>
                  <td className="px-6 py-4">
                    <span
                    onClick={()=>{
                      setInstructorData(instructor)
                      setEditInstructor(true)
                    }}
                      className="font-medium text-green-600 hover:underline mr-2 cursor-pointer"
                    >
                      Edit
                    </span>
                    <a
                      href="#"
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b hover:bg-gray-50">
                <td colSpan={6} className="px-6 py-4 text-center">
                  No instructors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
