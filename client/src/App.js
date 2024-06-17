import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import MainHeader from "./components/MainHeader/MainHeader";
import WelcomeHeader from "./components/WelcomeHeader/WelcomeHeader";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RaceWeekendPage from "./pages/RaceWeekendPage/RaceWeekendPage";
import ThisYearPage from "./pages/ThisYearPage/ThisYearPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import "./App.scss";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   // Check Session Storage to see if the use is logged in
  // }, []);

  return (
    <BrowserRouter>
      {loggedIn ? <ProfilePage /> : <WelcomeHeader />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home/:username" element={<ProfilePage />} />
        <Route path="/race-weekend/:raceName" element={<RaceWeekendPage />} />
        <Route path="/this-year" element={<ThisYearPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
