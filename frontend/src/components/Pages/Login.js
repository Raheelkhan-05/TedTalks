import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Ensure correct path
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import Google from './img/google.png';
import FB from './img/fb.png';
import { db } from './firebase'; // Ensure correct path
import axios from "axios";
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import './styles/LoginSignup.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isCheckingRecommendations, setIsCheckingRecommendations] = useState(false);
  const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

// For email/password login
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setIsCheckingRecommendations(true); // Start checking recommendations loading
  try {
    const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;

    // Set display name if not already set
    if (!user.displayName) {
      await updateProfile(user, { displayName: formData.email.split('@')[0] });
    }

    // Check if user is admin
    const userEmail = user.email.replace(/\./g, "_");
    const userDocRef = doc(db, "users", userEmail);
    const userDoc = await getDoc(userDocRef);
    console.log("User Document:", userDoc.data());
    
    if (userDoc.exists() && userDoc.data().isAdmin) {
      // Redirect admin users to admin panel
      setIsCheckingRecommendations(false);
      navigate("/admin");
    } else {
      // Check for recommended talks
      try {
        const historyRef = collection(db, `users/${userEmail}/history`);
        const historySnapshot = await getDocs(historyRef);
        
        if (!historySnapshot.empty) {
          const watchedTalks = historySnapshot.docs.map(doc => doc.data().talkId);
          
          if (watchedTalks.length > 0) {
            // User has watch history, check for recommendations
            const { data } = await axios.post(`${BACKEND_API}/api/recommendations`, {
              watched_talks: watchedTalks
            });
            
            if (data.talks && data.talks.length > 0) {
              // User has recommendations, redirect to recommended page
              alert('Login Successful!');
              setIsCheckingRecommendations(false);
              navigate("/recommended", { state: { recommendedTalks: data.talks } });
              return;
            }
          }
        }
        
        // No recommendations, redirect to home
        alert('Login Successful!');
        setIsCheckingRecommendations(false);
        navigate("/");
      } catch (error) {
        console.error("Error checking recommendations:", error);
        // If there's an error checking recommendations, just go to home
        alert('Login Successful!');
        setIsCheckingRecommendations(false);
        navigate("/");
      }
    }
  } catch (error) {
    alert('Login Failed: ' + error.message);
    setIsCheckingRecommendations(false);
  } finally {
    setIsLoading(false);
  }
};

// Similar update for Google login
const handleGoogleSignIn = async () => {
  setIsCheckingRecommendations(true); // Start checking recommendations loading
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = result.user;
    console.log("Google Sign-In Successful:", user);

    // Set display name if not already set
    if (!user.displayName) {
      await updateProfile(user, { displayName: user.email.split('@')[0] });
    }
    
    // Check if user exists in Firestore
    const userEmail = user.email.replace(/\./g, "_");
    const userDocRef = doc(db, "users", userEmail);
    const userDoc = await getDoc(userDocRef);
    
    // If the user doesn't exist in Firestore, create them
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        uid: user.uid,
        isAdmin: false,
        isGoogleUser: true,
        createdAt: new Date()
      });
    }
    
    // Check if user is admin
    if (userDoc.exists() && userDoc.data().isAdmin) {
      // Redirect admin users to admin panel
      setIsCheckingRecommendations(false);
      navigate("/admin");
    } else {
      // Check for recommended talks
      try {
        const historyRef = collection(db, `users/${userEmail}/history`);
        const historySnapshot = await getDocs(historyRef);
        
        if (!historySnapshot.empty) {
          const watchedTalks = historySnapshot.docs.map(doc => doc.data().talkId);
          
          if (watchedTalks.length > 0) {
            // User has watch history, check for recommendations
            const { data } = await axios.post(`${BACKEND_API}/api/recommendations`, {
              watched_talks: watchedTalks
            });
            
            if (data.talks && data.talks.length > 0) {
              // User has recommendations, redirect to recommended page
              alert("Login Successful!");
              setIsCheckingRecommendations(false);
              navigate("/recommended", { state: { recommendedTalks: data.talks } });
              return;
            }
          }
        }
        
        // No recommendations, redirect to home
        alert("Login Successful!");
        setIsCheckingRecommendations(false);
        navigate("/");
      } catch (error) {
        console.error("Error checking recommendations:", error);
        // If there's an error checking recommendations, just go to home
        alert("Login Successful!");
        setIsCheckingRecommendations(false);
        navigate("/");
      }
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Google Login Failed: " + error.message);
    setIsCheckingRecommendations(false);
  }
};

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ls-animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.ls-animate').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="ls-container" style={{ paddingTop: '7rem' }}>
      <div className="ls-decorative-shapes">
        <div className="ls-shape ls-shape1"></div>
        <div className="ls-shape ls-shape2"></div>
        <div className="ls-shape ls-shape3"></div>
        <div className="ls-shape ls-shape4"></div>
      </div>

      <div className="ls-content-wrapper">
      {isCheckingRecommendations && (
        <div className="ls-loading-overlay">
          <div className="ls-loading-spinner"></div>
          <p>Personalizing your experience...</p>
        </div>
      )}
        <div className="ls-left-panel ls-animate">
          <div className="ls-welcome-text">
            <h2>Welcome Back!</h2>
            <p>Discover amazing TED talks and get personalized recommendations.</p>
          </div>
          <div className="ls-feature-list">
            <div className="ls-feature-item">
              <span className="ls-feature-icon">🎯</span>
              <p>Personalized Recommendations</p>
            </div>
            <div className="ls-feature-item">
              <span className="ls-feature-icon">🌟</span>
              <p>Curated Collections</p>
            </div>
            <div className="ls-feature-item">
              <span className="ls-feature-icon">💡</span>
              <p>Inspiring Content</p>
            </div>
          </div>
        </div>

        <div className="ls-form-container ls-animate">
          <div className="ls-form-header">
            <h1>Log <span className="ls-highlight">In</span></h1>
            <div className="ls-title-underline"></div>
          </div>

          <form onSubmit={handleSubmit} className="ls-form">
            <div className="ls-input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="ls-input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            <div className="ls-form-options">
              <label className="ls-checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="ls-checkbox-label">Remember me</span>
              </label>
              <Link to="/forgot-password" className="ls-forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`ls-submit-btn ${isLoading ? 'ls-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="ls-social-login">
              <span className="ls-divider">or continue with</span>
              <div className="ls-social-buttons">
                <button type="button" className="ls-social-btn ls-google" onClick={handleGoogleSignIn}>
                  <img src={Google} alt="Google" /> Google
                </button>
                <button type="button" className="ls-social-btn ls-facebook">
                  <img src={FB} alt="Facebook" /> Facebook
                </button>
              </div>
            </div>
          </form>

          <p className="ls-signup-prompt">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;