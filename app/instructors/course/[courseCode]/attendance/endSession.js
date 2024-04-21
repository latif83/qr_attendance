"use client";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./startSession.module.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const EndSession = ({ setEndSession, sessionId,setFetchData }) => {
  const [submitEndSession, setSubmitEndSession] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const endSession = async () => {
      try {
        setLoading(true);

        const data = {
          sessionId,
        };

        const response = await fetch("/api/attendance", {
          method: "PUT",
          body: JSON.stringify(data),
        });

        const responseData = await response.json()

        if(!response.ok){
            setLoading(false);
            toast.error(responseData.error)
            return
        }
        
        toast.success(responseData.message)
        setFetchData(true)
        setEndSession(false)

      } catch (err) {
        console.log(err)
      }
    };
    
    if(submitEndSession){
        endSession()
        setSubmitEndSession(false)
    }
    
  }, [submitEndSession]);

  return (
    <div className={`${styles.container} flex items-center justify-center`}>
      <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded shadow p-6">
        <div className="flex justify-between mb-5">
          <h1 className="font-semibold">End Session</h1>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setEndSession(false)}
            className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
            color="red"
          />
        </div>
        <div>
          <p>Are you sure you want to end the session?</p>
          <div className="flex mt-5 justify-between">
            <button onClick={()=>setSubmitEndSession(true)} className="p-2 rounded bg-green-700 hover:bg-green-600 text-white">
              Confirm
            </button>

            <button onClick={()=>setEndSession(false)} className="p-2 rounded bg-red-700 hover:bg-red-600 text-white">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
