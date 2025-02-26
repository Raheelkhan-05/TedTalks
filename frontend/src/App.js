// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Pages/Layout';
import HomePage from './components/Pages/HomePage';
import AboutPage from './components/Pages/AboutPage';
import ExplorePage from './components/Pages/ExplorePage';
import FAQPage from './components/Pages/FAQPage';
import ContactPage from './components/Pages/ContactPage';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import TermsOfService from './components/Pages/TermsofService';
import Login from './components/Pages/Login';
import Signup from './components/Pages/Signup';
import ForgotPassword from './components/Pages/ForgotPassword';
import CategoryPage from './components/Pages/CategoryPage';
import EventsPage from './components/Pages/EventsPage';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="explore" element={<ExplorePage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="policy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<TermsOfService />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="categories" element={<CategoryPage/>} />
                    <Route path="events" element={<EventsPage />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
