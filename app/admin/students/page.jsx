"use client";
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NStudents } from "./nStudents";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Students() {
  const [addStudent, setAddStudent] = useState(false);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(true);

  useEffect(() => {
    const getStudents = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/students");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setLoading(false);

        setStudents(responseData.students);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    if (fetchData) {
      getStudents();
      setFetchData(false);
    }
  }, [fetchData]);

  return (
    <div className="h-full">
      {addStudent && <NStudents setAddStudent={setAddStudent} setFetchData={setFetchData} />}
      <h1>Students</h1>

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
                placeholder="Search students"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => setAddStudent(true)}
              className="p-2 rounded-lg bg-gray-50 flex gap-2 items-center hover:bg-gray-200 text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Student
            </button>
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">
                Student Id
              </th>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Email
              </th>
              <th scope="col" class="px-6 py-3">
                Level
              </th>
              <th scope="col" class="px-6 py-3">
                Contact
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr class="bg-white border-b hover:bg-gray-50">
                <td colSpan={5} class="px-6 py-4 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student) => (
                <tr class="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {student.studid}
                  </th>
                  <td class="px-6 py-4">{student.fname} {student.lname}</td>
                  <td class="px-6 py-4">{student.email}</td>
                  <td class="px-6 py-4">{student.level}</td>
                  <td class="px-6 py-4">{student.contact}</td>
                  <td class="px-6 py-4">
                    <a
                      href="#"
                      class="font-medium text-green-600 hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      class="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr class="bg-white border-b hover:bg-gray-50">
                {" "}
                <td class="px-6 py-4">No Students found.</td>{" "}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
