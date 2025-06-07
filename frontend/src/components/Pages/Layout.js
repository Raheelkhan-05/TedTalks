import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/HomePage.css";
import './styles/Layout.css';
import { auth, db } from "./firebase"; 
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; 
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, getDoc } from "firebase/firestore";
 
const Layout = () => 
{
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = auth.currentUser;
  const [isAdmin, setIsAdmin] = useState(false);
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  const [currentUser, setCurrentUser] = useState(null);  // <-- Store user state properly

  const queryParams = new URLSearchParams(location.search);
  const currentTag = queryParams.get("tag");

  const categories = ["technology", "science", "business", "society", "TEDx"];


  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        try {
          const userEmail = user.email.replace(/\./g, "_");
          const userDocRef = doc(db, "users", userEmail);
          console.log("User Document Reference:", userDocRef);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("User Data from Firestore:", userData);
            
            setIsAdmin(userData.isAdmin === true); // strictly check true
          } else {
            console.warn("User document not found in Firestore for UID:", uid);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Firestore error:", error);
          setIsAdmin(false);
        } 
      } else {
        // Not logged in
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser); // Update user state
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      setCurrentUser(null); // Immediately update UI after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <header>
        <a href="/" style={{ textDecoration: "none" }}>
        <div className="logo">
          <span>TED</span>Talks
        </div>
        </a>
        {/* Mobile menu button - only visible on small screens */}
        <div className="mobile-menu-button">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              // X icon when menu is open
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Navigation menu - desktop visible by default, mobile controlled by state */}
        <nav className={isMenuOpen ? "mobile-nav-open" : ""} >
          <ul>
            {console.log("User from layout:", isAdmin)}
            {isAdmin && (
          <li>
            <Link
              to="/admin"
              className={location.pathname === "/admin" ? "active" : ""}
            >
              Admin
            </Link>
          </li>
        )}

            <li>
              <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            </li>
            <li>
              <Link to="/explore" className={location.pathname === "/explore" ? "active" : ""}>Explore</Link>
            </li>
            <li>
              <Link 
                to="/categories" 
                className={location.pathname.startsWith("/categories") ? "active" : ""}
              >
                Categories
              </Link>
            </li>

            <li>
              <Link to="/events" className={location.pathname === "/events" ? "active" : ""}>Events</Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
            </li>
            {currentUser ? (
            <li>
              <Link to="/history" className={location.pathname === "/history" ? "active" : ""}>History</Link>
            </li>
            ) : (<></>)}
            
            <li className="login-button-container center">
              {currentUser ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* User Initial */}
                  <div style={{
                    display: "inline-block",
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: "#007bff",
                    color: "white",
                    textAlign: "center",
                    lineHeight: "35px",
                    fontSize: "15px",
                    fontWeight: "bold",
                    cursor: "not-allowed"
                  }}>
                    {userInitial}
                  </div>

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    style={{
                      backgroundColor: "#ff3525",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className={`login-button ${location.pathname === "/login" || location.pathname === "/signup" ? "active" : ""}`}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ paddingTop: "1px" }}
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>&nbsp;
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </header>

      {/* Page content */}
      <div className="home-container">
        {/* Background Elements */}
        <div className="bg-element orb orb-1"></div>
        <div className="bg-element orb orb-2"></div>
        <div className="bg-element orb orb-3"></div>
        <div className="grid-background"></div>
        <Outlet />
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-about">
            <div className="logo">
              <span>TED</span>Talks
            </div>
            <br />
            <p>
              Ideas worth spreading. TED is a nonprofit devoted to spreading
              ideas, usually in the form of short, powerful talks.
            </p>
            <div className="social-icons">
              <a
                href="#"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path d="M18.48 7.7H16.68V6.35c0-.47.48-.57.82-.57h.97V3.55h-1.9c-2.12 0-2.6 1.58-2.6 2.6V7.7h-1.23v2.24h1.23V17.1h2.6V9.94h1.75l.16-2.24z" />
                </svg>
              </a>
              <a
                href="#"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.38 4 16.26 4c-2.13 0-3.86 1.73-3.86 3.86 0 .3.03.6.1.89-3.2-.16-6.04-1.7-7.93-4.04-.33.58-.52 1.25-.52 1.96 0 1.34.68 2.52 1.72 3.21-.63-.02-1.22-.19-1.74-.48v.05c0 1.87 1.33 3.43 3.1 3.78-.32.09-.66.14-1.02.14-.25 0-.49-.03-.73-.07.49 1.53 1.92 2.64 3.62 2.67-1.33 1.04-3 1.66-4.82 1.66-.31 0-.62-.02-.93-.06 1.72 1.1 3.75 1.75 5.94 1.75 7.13 0 11.02-5.9 11.02-11.02 0-.17 0-.34-.01-.5.76-.55 1.42-1.23 1.94-2.01z" />
                </svg>
              </a>
              <a
                href="#"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </a>
              <a
                href="#"
                className="social-icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.55 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.55-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
              </li>
              <li>
                <Link to="/explore" className={location.pathname === "/explore" ? "active" : ""}>Explore</Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className={location.pathname.startsWith("/categories") ? "active" : ""}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/events" className={location.pathname === "/events" ? "active" : ""}>Events</Link>
              </li>
              <li>
                <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
      <h4>Categories</h4>
      
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link
              to={`/categories?tag=${category}`} style={{textTransform: "capitalize"}}
              className={currentTag === category ? "active" : ""}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li>
                <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className={location.pathname === "/faq" ? "active" : ""}>FAQs</Link>
              </li>
              <li>
                <Link to="/policy" className={location.pathname === "/policy" ? "active" : ""}>Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className={location.pathname === "/terms" ? "active" : ""}>Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="copyright">
          <p>&copy; 2025 TEDTalks. All rights reserved.</p>
        </div> */}
      </footer>
    </>
  );
};

export default Layout;