"use client"
import { faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function Course({ params }) {

  const [studentsCount,setStudentsCount] = useState(0)

  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(true);

  useEffect(() => {
    const getStudentsCount = async () => {
      try {
        setLoading(true);

        const data = {
          courseId : params.courseCode
        }

        const response = await fetch(`/api/attendance/students?courseId=${params.courseCode}`);
        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          return;
        }

        setLoading(false);

        setStudentsCount(responseData.studentsCount);
      } catch (err) {
        console.log(err);
        toast.error("An unexpected error happended, Please try again later.");
      }
    };

    getStudentsCount();

  }, []);

  return (
    <div className="mt-5">
      <div className="grid grid-cols-3">
        <div className="bg-white p-3 shadow-lg flex items-center gap-4 rounded border">
            <div>
                <FontAwesomeIcon icon={faUsersBetweenLines} className="text-2xl" width={50} height={50} />
            </div>
          <div>
          <h1 className="text-xl font-bold">{studentsCount}</h1>
          <p>{studentsCount > 1 ? 'Students' : 'Student'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
