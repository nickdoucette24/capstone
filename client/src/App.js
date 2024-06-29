import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
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
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        {loggedIn ? (
          <>
            <Route path="/home/:username/:id" element={<ProfilePage />} />
          </>
        ) : (
          <Route path="/" element={<WelcomePage />} />
        )}
        <Route path="/race-weekend" element={<RaceWeekendPage />} />
        <Route path="/this-year" element={<ThisYearPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
