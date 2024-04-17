import { faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Course({ params }) {
  return (
    <div className="mt-5">
      <div className="grid grid-cols-3">
        <div className="bg-white p-3 shadow-lg flex items-center gap-4 rounded border">
            <div>
                <FontAwesomeIcon icon={faUsersBetweenLines} className="text-2xl" width={50} height={50} />
            </div>
          <div>
          <h1 className="text-xl font-bold">42</h1>
          <p>Students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
