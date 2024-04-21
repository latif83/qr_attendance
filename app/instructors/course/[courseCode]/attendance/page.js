"use client";
import {
  faCode,
  faKeyboard,
  faPlay,
  faQrcode,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AttendanceHistory } from "./history";
import { StartSession } from "./startSession";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EndSession } from "./endSession";
import { Codes } from "./code";

export default function Attendance({ params }) {
  const [startSession, setStartSession] = useState(false);
  const [endSession, setEndSession] = useState(false);
  const [viewCode, setViewCode] = useState(false);
  const [viewCodeQR, setViewCodeQR] = useState(false);

  // const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const [activeSession, setActiveSession] = useState(false);
  const [session, setSession] = useState({});

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/attendance?courseId=${params.courseCode}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setLoading(false);

        // console.log(responseData);

        setActiveSession(responseData.active);

        setSession(responseData.activeSession);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    if (fetchData) {
      checkActiveSession();
      setFetchData(false);
    }
  }, [fetchData]);

  return (
    <div>
      {startSession && (
        <StartSession
          setStartSession={setStartSession}
          courseCode={params.courseCode}
          setFetchData={setFetchData}
        />
      )}

      {endSession && (
        <EndSession
          setEndSession={setEndSession}
          sessionId={session.id}
          setFetchData={setFetchData}
        />
      )}

      {viewCode && (
        <Codes code={session.attendanceCode} setViewCode={setViewCode} viewCodeQR={viewCodeQR} />
      )}

      <h1>Attendance</h1>

      <div className="flex justify-center mt-5">
        <div>
          {activeSession ? (
            <div className="flex flex-col items-center gap-2 justify-center">
              <button
                onClick={() => setEndSession(true)}
                className="shadow-lg shadow-red-500/50 hover:bg-red-500 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center"
              >
                <FontAwesomeIcon icon={faStop} />
              </button>
              <span>End Session</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 justify-center">
              <button
                onClick={() => setStartSession(true)}
                className="shadow-lg shadow-green-500/50 hover:bg-green-500 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center"
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <span>Start Session</span>
            </div>
          )}

          <div className="flex gap-6 mt-5">
            <button
              onClick={() => {setViewCode(activeSession); setViewCodeQR(false); }}
              className={`bg-white p-2 rounded shadow-lg border hover:bg-green-200 ${
                !activeSession && "opacity-50"
              }`}
            >
              <FontAwesomeIcon className="mr-2" icon={faKeyboard} />
              Attendance Code
            </button>

            <button
              onClick={() => {setViewCode(activeSession); setViewCodeQR(true); }}
              className={`bg-white p-2 rounded shadow-lg border hover:bg-green-200 ${
                !activeSession && "opacity-50"
              }`}
            >
              <FontAwesomeIcon className="mr-2" icon={faQrcode} />
              QR Code
            </button>
          </div>
        </div>
      </div>

      <AttendanceHistory courseId={params.courseCode} />
    </div>
  );
}
