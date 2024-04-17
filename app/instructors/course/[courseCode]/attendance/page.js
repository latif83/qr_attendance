import { faCode, faKeyboard, faPlay, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AttendanceHistory } from "./history";

export default function Attendance() {
  return (
    <div>
      <h1>Attendance</h1>

      <div className="flex justify-center mt-5">
        <div>
          <div className="flex flex-col items-center gap-2 justify-center">
            <button
              // onClick={() => setAuthenticate(true)}
              className="shadow-lg shadow-green-500/50 hover:bg-green-500 ease-in-out duration-500 font-medium rounded-full text-sm px-4 py-3 text-center"
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
            <span>Start</span>
          </div>

          <div className="flex gap-6 mt-5">
            <button className="bg-white p-2 rounded shadow-lg border hover:bg-green-200">
                <FontAwesomeIcon className="mr-2" icon={faKeyboard} />
                Attendance Code
                </button>

                <button className="bg-white p-2 rounded shadow-lg border hover:bg-green-200">
                <FontAwesomeIcon className="mr-2" icon={faQrcode} />
                QR Code
                </button>
          </div>
        </div>
      </div>

      <AttendanceHistory />
    </div>
  );
}
