import { useParams } from "react-router-dom";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const { username } = useParams();

  return (
    <div className="profile-page">
      <h1>Welcome, {username}</h1>
    </div>
  );
};

export default ProfilePage;
