"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./startSession.module.css";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StartSession = ({ setStartSession, courseCode,setFetchData }) => {
  const [randomCode, setRandomCode] = useState("");

  const generaterandomCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomCode = "";
    const codeLength = 6; // You can adjust the length of the code as needed

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters[randomIndex];
    }

    setRandomCode(randomCode);
  };

  const [loading, setLoading] = useState(false);

  const [sData, setSData] = useState(false);

  const [formData, setFormData] = useState(null);

  const submit = (fData) => {
    setFormData(fData);
    setSData(true);
  };

  useEffect(() => {
    const startSession = async () => {
      try {
        setLoading(true);

        const data = {
          courseId: courseCode,
          attendanceCode: formData.get("code"),
          password: formData.get("password"),
        };

        const response = await fetch("/api/attendance", {
          method: "POST",
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
        setStartSession(false);
      } catch (err) {
        console.log(err);
      }
    };

    if (sData) {
      startSession();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Start Session</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setStartSession(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <form action={submit}>
          <div className="mb-5">
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="code"
                id="code"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                required
                value={randomCode}
                onChange={(e) => setRandomCode(e.target.value)}
              />
              <label
                htmlFor="code"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Attendance Code
              </label>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={generaterandomCode}
                className="bg-blue-700 text-gray-100 p-2 rounded text-xs"
              >
                Generate Code
              </button>
            </div>
          </div>

          <div className="relative z-0 w-full group mb-5">
            <input
              type="password"
              name="password"
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 disabled:bg-green-200 hover:bg-green-600 text-white font-medium rounded py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Start
                Session{" "}
              </>
            ) : (
              "Start Session"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
