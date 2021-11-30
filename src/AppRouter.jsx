import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import PageLayout from "./components/Layout/PageLayout";
import FeupExchangePage from "./pages/FeupExchangePage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TimeTablePage from "./pages/TimeTablePage";

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route
                exact
                path="/"
                key="/"
                element={
                    <PageLayout key="/">
                        <HomePage />
                    </PageLayout>
                }
            />
                
            <Route
                exact
                path="/profile"
                key="/profile"
                element={
                    <PageLayout key="/profile">
                        <ProfilePage />
                    </PageLayout>
                }
            />
            <Route
                exact
                path="/timetable"
                element={
                    <PageLayout key="/">
                        <TimeTablePage />
                    </PageLayout>
                }
            />
            <Route
                exact
                path="/feupexchange"
                element={
                    <PageLayout key="/">
                        <FeupExchangePage />
                    </PageLayout>
                }
            />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
