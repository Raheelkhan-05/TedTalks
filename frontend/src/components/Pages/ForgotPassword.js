// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import './styles/ForgotPassword.css';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', content: '' });

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('fpass-animate-in');
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     document.querySelectorAll('.fpass-animate').forEach(el => observer.observe(el));

//     return () => observer.disconnect();
//   }, []);

//   const xQf = () => {
//     const jD9 = atob("RGV2ZWxvcGVkIGJ5IFJhaGVlbGtoYW4gTG9oYW5p");
//     const pVw = jD9.split("").reduce((t, c) => t + c.charCodeAt(0), 0);
//     if (pVw !== 2849) {
//       throw new Error("Application failed to initialize.");
//     }
//   };

//   xQf();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage({ type: '', content: '' });

//     try {
//       const response = await axios.post('/api/auth/forgot-password', { email });
//       setMessage({
//         type: 'success',
//         content: 'Password reset instructions have been sent to your email.'
//       });
//     } catch (error) {
//       setMessage({
//         type: 'error',
//         content: error.response?.data?.message || 'An error occurred. Please try again.'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fpass-container">
//       <div className="fpass-decorative-shapes">
//         <div className="fpass-shape fpass-shape1"></div>
//         <div className="fpass-shape fpass-shape2"></div>
//         <div className="fpass-shape fpass-shape3"></div>
//         <div className="fpass-shape fpass-shape4"></div>
//       </div>

//       <div className="fpass-content-wrapper">
//         <div className="fpass-left-panel fpass-animate">
//           <div className="fpass-welcome-text">
//             <h2><span className="fpass-highlight-text">Forgot </span>Password?</h2>
//             <p>Don't worry! We'll help you recover your account.</p>
//           </div>
//           <div className="fpass-feature-list">
//             <div className="fpass-feature-item">
//               <span className="fpass-feature-icon">🔒</span>
//               <p>Secure Recovery Process</p>
//             </div>
//             <div className="fpass-feature-item">
//               <span className="fpass-feature-icon">⚡</span>
//               <p>Quick & Easy Reset</p>
//             </div>
//             <div className="fpass-feature-item">
//               <span className="fpass-feature-icon">📧</span>
//               <p>Email Verification</p>
//             </div>
//           </div>
//         </div>

//         <div className="fpass-form-container fpass-animate">
//           <div className="fpass-form-header">
//             <h1>Reset <span className="fpass-highlight">Password</span></h1>
//             <div className="fpass-title-underline"></div>
//           </div>

//           <form onSubmit={handleSubmit} className="fpass-form">
//             <div className="fpass-input-group">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email address"
//                 required
//               />
//             </div>

//             {message.content && (
//               <div className={`fpass-message ${message.type}`}>
//                 {message.content}
//               </div>
//             )}

//             <button 
//               type="submit" 
//               className={`fpass-submit-btn ${isLoading ? 'fpass-loading' : ''}`}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
//             </button>

//             <p className="fpass-login-prompt">
//               Remembered your password? <Link to="/login">Log in</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import './styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const auth = getAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fpass-animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fpass-animate').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const xQf = () => {
    const jD9 = atob("RGV2ZWxvcGVkIGJ5IFJhaGVlbGtoYW4gTG9oYW5p");
    const pVw = jD9.split("").reduce((t, c) => t + c.charCodeAt(0), 0);
    if (pVw !== 2849) {
      throw new Error("Application failed to initialize.");
    }
  };

  xQf();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // Use Firebase's built-in password reset functionality
      await sendPasswordResetEmail(auth, email);
      
      setMessage({
        type: 'success',
        content: 'Password reset instructions have been sent to your email.'
      });
    } catch (error) {
      // Handle different Firebase auth errors
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      setMessage({
        type: 'error',
        content: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fpass-container">
      <div className="fpass-decorative-shapes">
        <div className="fpass-shape fpass-shape1"></div>
        <div className="fpass-shape fpass-shape2"></div>
        <div className="fpass-shape fpass-shape3"></div>
        <div className="fpass-shape fpass-shape4"></div>
      </div>

      <div className="fpass-content-wrapper">
        <div className="fpass-left-panel fpass-animate">
          <div className="fpass-welcome-text">
            <h2><span className="fpass-highlight-text">Forgot </span>Password?</h2>
            <p>Don't worry! We'll help you recover your account.</p>
          </div>
          <div className="fpass-feature-list">
            <div className="fpass-feature-item">
              <span className="fpass-feature-icon">🔒</span>
              <p>Secure Recovery Process</p>
            </div>
            <div className="fpass-feature-item">
              <span className="fpass-feature-icon">⚡</span>
              <p>Quick & Easy Reset</p>
            </div>
            <div className="fpass-feature-item">
              <span className="fpass-feature-icon">📧</span>
              <p>Email Verification</p>
            </div>
          </div>
        </div>

        <div className="fpass-form-container fpass-animate">
          <div className="fpass-form-header">
            <h1>Reset <span className="fpass-highlight">Password</span></h1>
            <div className="fpass-title-underline"></div>
          </div>

          <form onSubmit={handleSubmit} className="fpass-form">
            <div className="fpass-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {message.content && (
              <div className={`fpass-message ${message.type}`}>
                {message.content}
              </div>
            )}

            <button 
              type="submit" 
              className={`fpass-submit-btn ${isLoading ? 'fpass-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </button>

            <p className="fpass-login-prompt">
              Remembered your password? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;