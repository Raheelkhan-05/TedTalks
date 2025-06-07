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
import AuthGuard from './components/AuthGuard';
import ViewAllSpeakers from './components/Pages/ViewAllSpeakers';
import VideoPlayerPage from './components/VideoPlayerPage';
import ScrollToTop from './components/ScrollToTop';
import SearchResults from './components/Pages/SearchResults';
import HistoryPage from './components/Pages/HistoryPage';
import AuthGuard2 from './components/AuthGuard2';
import AdminPanel from './components/AdminPanel';
import AdminGuard from './components/AdminGuard';
import RecommendedPage from './components/Pages/RecommendedPage';

function App() {
    return (
        <div className="App">
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="explore" element={<ExplorePage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="policy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<TermsOfService />} />

                    {/* Protected Login & Signup Routes */}
                    <Route element={<AuthGuard />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>

                    <Route element={<AuthGuard2 />}>
                        <Route path="history" element={<HistoryPage />} />
                        <Route path="recommended" element={<RecommendedPage />} />    
                    </Route>
                    

                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="categories" element={<CategoryPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="speakers" element={<ViewAllSpeakers />} />
                    

                    {/* Video Player Route - Pass only talkId */}
                    <Route path="video/:talkId" element={<VideoPlayerPage />} />

                    <Route path="/search-results" element={<SearchResults />} />
                    <Route
                        path="admin"
                        element={
                            <AdminGuard>
                            <AdminPanel />
                            </AdminGuard>
                        }
                        />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
