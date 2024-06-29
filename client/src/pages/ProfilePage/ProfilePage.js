import { useParams } from "react-router-dom";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const { username, id } = useParams();

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <p>Your ID: {id}</p>
    </div>
  );
};

export default ProfilePage;
