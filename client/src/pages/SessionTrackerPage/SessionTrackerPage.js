import { useParams } from "react-router-dom";
import "./SessionTrackerPage.scss";

const SessionTrackerPage = () => {
  const { session } = useParams();
  return <div>SessionTrackerPage</div>;
};

export default SessionTrackerPage;
