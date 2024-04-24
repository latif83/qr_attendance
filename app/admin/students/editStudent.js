"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./nStudents.module.css";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const EditStudent = ({ setEditStudent, setFetchData, studentData }) => {
  const [sData, setSData] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(null);

  const [fname,setFName] = useState("")
  const [lname,setLName] = useState("")
  const [email,setEmail] = useState("")
  const [contact,setContact] = useState("")
  const [studid,setStudId] = useState("")
  const [address,setAddress] = useState("")
  const [level,setLevel] = useState("")

  const submit = (fData) => {
    setFormData(fData);
    setSData(true);
  };

  useEffect(() => {

    setFName(studentData.fname)
    setLName(studentData.lname)
    setEmail(studentData.email)
    setContact(studentData.contact)
    setStudId(studentData.studid)
    setAddress(studentData.address)
    setLevel(studentData.level)

    const editStudent = async () => {
      try {
        setLoading(true);

        const data = {
          fname,
          lname,
          email,
          contact,
          student_id : studid,
          address,
          level,
          id : studentData.id
        };

        // console.log(data)

        const response = await fetch("/api/students", {
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
        setFetchData(true)
        setEditStudent(false)
      } catch (err) {
        console.log(err);
      }
    };

    if (sData) {
      editStudent();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Edit Student</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setEditStudent(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <form action={submit}>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="fname"
                id="fname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={fname}
                onChange={(e)=>setFName(e.target.value)}
              />
              <label
                htmlFor="fname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First Name
              </label>
            </div>
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="lname"
                id="lname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={lname}
                onChange={(e)=>setLName(e.target.value)}
              />
              <label
                htmlFor="lname"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last Name
              </label>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="contact"
                id="contact"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={contact}
                onChange={(e)=>setContact(e.target.value)}
              />
              <label
                htmlFor="contact"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone Number
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="student_id"
                id="student_id"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={studid}
                onChange={(e)=>setStudId(e.target.value)}
              />
              <label
                htmlFor="student_id"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Student Id
              </label>
            </div>
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="address"
                id="address"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
              />
              <label
                htmlFor="address"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Address
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full group mb-5">
            <label
              htmlFor="level"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Level
            </label>
            <select
              id="level"
              name="level"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              required
              value={level}
                onChange={(e)=>setLevel(e.target.value)}
            >
              <option value="">Select Level</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={300}>300</option>
              <option value={400}>400</option>
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
                Changes{" "}
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
