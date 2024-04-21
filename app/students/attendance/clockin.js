"use client";
import {
  faKeyboard,
  faQrcode,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./clockin.module.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ClockIn = ({ setAuthDone,setFetchData }) => {
  const [pickQRChoice, setPickQRChoice] = useState(true);

  const [enterAttendanceCode, setEnterAttendanceCode] = useState(false);

  const [attendanceCode, setAttendanceCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [sData, setSData] = useState(false);

  const submit = () => {
    setSData(true);
  };

  useEffect(() => {
    const sendAttendance = async () => {
      try {
        setLoading(true);

        const data = {
          attendanceSessionCode: attendanceCode,
        };

        const response = await fetch("/api/attendance/clockin/in", {
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

        setAuthDone(false);
      } catch (err) {
        console.log(err);
      }
    };

    if (sData) {
      sendAttendance();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">Clock In</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setAuthDone(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>

        {pickQRChoice && (
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                onClick={() => {
                  setEnterAttendanceCode(true);
                  setPickQRChoice(false);
                }}
                className="shadow-lg shadow-gray-500/50 hover:bg-gray-700 ease-in-out duration-500 font-medium rounded-full text-3xl px-3 py-3 text-center hover:text-white"
              >
                <FontAwesomeIcon icon={faKeyboard} />
              </button>
              <p className="text-xs font-semibold text-center">
                Enter Attendance Code <br />{" "}
                <small className="text-red-500" style={{ fontStyle: "italic" }}>
                  {" "}
                  See Instructor for code{" "}
                </small>{" "}
              </p>
            </div>

            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                onClick={() => {
                  setPickQRChoice(false);
                }}
                className="shadow-lg shadow-gray-500/50 hover:bg-gray-700 ease-in-out duration-500 font-medium rounded-full text-3xl px-4 py-3 text-center hover:text-white"
              >
                <FontAwesomeIcon icon={faQrcode} />
              </button>
              <p className="text-xs font-semibold">Scan QR Code</p>
            </div>
          </div>
        )}

        {enterAttendanceCode && (
          <form action={submit}>
            <div className="relative z-0 w-full group">
              <input
                type="attendanceCode"
                name="attendanceCode"
                id="attendanceCode"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value)}
              />
              <label
                htmlFor="attendanceCode"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Enter Attendance Code
              </label>
            </div>
            <p>
              <small
                className="text-red-500 text-xs font-semibold"
                style={{ fontStyle: "italic" }}
              >
                See Instructor for Code
              </small>
            </p>

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 disabled:bg-green-200 hover:bg-green-600 text-white font-medium rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />{" "}
                    Submit{" "}
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
