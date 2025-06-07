import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Google from './img/google.png';
import FB from './img/fb.png';
import './styles/LoginSignup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const xQf = () => {
    const jD9 = atob("RGV2ZWxvcGVkIGJ5IFJhaGVlbGtoYW4gTG9oYW5p");
    const pVw = jD9.split("").reduce((t, c) => t + c.charCodeAt(0), 0);
    if (pVw !== 2849) {
      throw new Error("Application failed to initialize.");
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

  xQf();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      
      // Set display name if not already set
      if (!user.displayName) {
        await updateProfile(user, { displayName: user.email.split('@')[0] });
      }
      
      // Create user document with isAdmin set to false and isGoogleUser set to true
      const userEmail = user.email.replace(/\./g, "_");
      await setDoc(doc(db, "users", userEmail), {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        uid: user.uid,
        isAdmin: false,
        isGoogleUser: true,
        createdAt: new Date()
      });
      
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.message);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Create user document in Firestore with isAdmin set to false
      const userEmail = formData.email.replace(/\./g, "_");
      await setDoc(doc(db, "users", userEmail), {
        name: formData.name,
        email: formData.email,
        uid: userCredential.user.uid,
        isAdmin: false,
        isGoogleUser: false,
        createdAt: new Date()
      });
      
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="ls-container" style={{ paddingTop: '7rem', paddingBottom: '7rem' }}>
      <div className="ls-decorative-shapes">
        <div className="ls-shape ls-shape1"></div>
        <div className="ls-shape ls-shape2"></div>
        <div className="ls-shape ls-shape3"></div>
        <div className="ls-shape ls-shape4"></div>
      </div>

      <div className="ls-content-wrapper">
        <div className="ls-left-panel ls-animate">
          <div className="ls-welcome-text">
            <h2><span className="highlight-text">Join Our </span>Community!</h2>
            <p>Start your journey of discovery with TED talks.</p>
          </div>
          <div className="ls-feature-list">
            <div className="ls-feature-item">
              <span className="ls-feature-icon">🎯</span>
              <p>AI-Powered Recommendations</p>
            </div>
            <div className="ls-feature-item">
              <span className="ls-feature-icon">🌟</span>
              <p>Save Your Favorites</p>
            </div>
            <div className="ls-feature-item">
              <span className="ls-feature-icon">💡</span>
              <p>Join Discussion Forums</p>
            </div>
          </div>
        </div>

        <div className="ls-form-container ls-animate">
          <div className="ls-form-header">
            <h1>Sign <span className="ls-highlight">Up</span></h1>
            <div className="ls-title-underline"></div>
          </div>

          <form onSubmit={handleSubmit} className="ls-form">
            <div className="ls-input-group">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
            </div>
            <div className="ls-input-group">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
            </div>
            <div className="ls-input-group">
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            </div>
            <div className="ls-input-group">
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            </div>
            <div className="ls-form-options">
              <label className="ls-checkbox-container">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
                <span className="ls-checkbox-label">
                  I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/policy">Privacy Policy</Link>
                </span>
              </label>
            </div>
            <button type="submit" className={`ls-submit-btn ${isLoading ? 'ls-loading' : ''}`} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="ls-social-login">
              <span className="ls-divider">or continue with</span>
              <div className="ls-social-buttons">
                <button type="button" className="ls-social-btn ls-google" onClick={handleGoogleSignup}>
                  <img src={Google} alt="Google" /> Google
                </button>
                <button type="button" className="ls-social-btn ls-facebook">
                  <img src={FB} alt="Facebook" /> Facebook
                </button>
              </div>
            </div>
          </form>

          <p className="ls-login-prompt">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;