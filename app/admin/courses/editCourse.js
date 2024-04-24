"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./addCourse.module.css";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const EditCourse = ({ setEditCourse, setFetchData, courseData }) => {
  const [loading, setLoading] = useState(false);

  const [sData, setSData] = useState(false);
  const [formData, setFormData] = useState(null);

  const [instructors, setInstructors] = useState([]);

  const [instructorsLoading, setInstructorsLoading] = useState(false);

  const submit = (fData) => {
    setFormData(fData);
    setSData(true);
  };

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [instructor, setInstructor] = useState("");

  useEffect(() => {
    const getInstructors = async () => {
      try {
        setInstructorsLoading(true);

        const response = await fetch("/api/instructors");
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setInstructorsLoading(false);

        setInstructors(responseData.Instructors);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    getInstructors();
  }, []);

  useEffect(() => {
    setTitle(courseData.title);
    setCode(courseData.code);
    setInstructor(courseData.instructor.id);

    const editCourse = async () => {
      try {
        setLoading(true);

        const data = {
          id: courseData.id,
          title,
          code,
          instructorId: instructor,
        };

        const response = await fetch("/api/courses", {
          method: "PUT",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          setLoading(false);
          toast.error(responseData.error);
          return;
        }

        toast.success(responseData.message);
        setFetchData(true);
        setEditCourse(false);
      } catch (err) {
        console.log(err);
      }
    };

    if (sData) {
      editCourse();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Edit Course</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setEditCourse(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <form action={submit}>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="title"
                id="title"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label
                htmlFor="title"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Course Title
              </label>
            </div>
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="code"
                id="code"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <label
                htmlFor="code"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Course Code
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full group mb-5">
            <label
              htmlFor="dept"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Instructor
            </label>
            <select
              id="instructor"
              name="instructor"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              required
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            >
              <option value="">Select Instructor</option>
              {instructorsLoading ? (
                <option>
                  {" "}
                  <FontAwesomeIcon
                    icon={faSpinner}
                    color="red"
                    className="text-lg"
                    spin
                  />{" "}
                  Loading Instructors...{" "}
                </option>
              ) : instructors.length > 0 ? (
                instructors.map((instructor) => (
                  <option value={instructor.id}>
                    {instructor.fname} {instructor.lname}
                  </option>
                ))
              ) : (
                <option>No instructors found.</option>
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
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Save
                Changed{" "}
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
