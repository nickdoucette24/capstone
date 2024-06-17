import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainHeader from "./components/MainHeader/MainHeader";
import WelcomeHeader from "./components/WelcomeHeader/WelcomeHeader";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RaceWeekendPage from "./pages/RaceWeekendPage/RaceWeekendPage";
import ThisYearPage from "./pages/ThisYearPage/ThisYearPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import useAuth from "./hooks/useAuth";
import "./App.scss";

// Main App Component
function App() {
  const loggedIn = useAuth();

  return (
    <BrowserRouter>
      {loggedIn ? <MainHeader /> : <WelcomeHeader />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        {loggedIn && (
          <>
            <Route path="/home/:username" element={<ProfilePage />} />
            <Route
              path="/race-weekend/:raceName"
              element={<RaceWeekendPage />}
            />
            <Route path="/this-year" element={<ThisYearPage />} />
          </>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
