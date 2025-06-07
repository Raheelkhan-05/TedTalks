import React, { useEffect, useRef, useState } from 'react';
import './styles/ContactPage.css';

const ContactPage = () => {
  const titleRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const xQf = () => {
    const jD9 = atob("RGV2ZWxvcGVkIGJ5IFJhaGVlbGtoYW4gTG9oYW5p");
    const pVw = jD9.split("").reduce((t, c) => t + c.charCodeAt(0), 0);
    if (pVw !== 2849) {
      throw new Error("Application failed to initialize.");
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('.animate-section').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  xQf();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');
    
    // Simulated API call
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="contact-container">
      {/* Header Section */}
      <div className="contact-header">
        <h1 className="contact-title" ref={titleRef}>
          Get in <span className="highlight">Touch</span>
        </h1>
        <div className="title-underline"></div>
      </div>

      {/* Main Contact Section */}
      <section className="contact-section animate-section">
        <div className="section-content">
          <div className="contact-grid">
           { /* Contact Information */}
                        <div className="contact-info">
                          <h2>Connect With Us</h2>
                          <p>Have questions or want to collaborate? We'd love to hear from you. Reach out through any of these channels:</p>
                          
                          <div className="contact-details">
                            <div className="contact-item">
                              <div className="contact-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                              </div>
                              <div className="detail-content">
                                <h3>Phone</h3>
                                <p>+91 (000) 000-0000</p>
                              </div>
                            </div>

                            <div className="contact-item">
                              <div className="contact-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                  <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                              </div>
                              <div className="detail-content">
                                <h3>Email</h3>
                                <p>sample@sample.com</p>
                              </div>
                            </div>

                            <div className="contact-item">
                              <div className="contact-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                  <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                              </div>
                              <div className="detail-content">
                                <h3>Location</h3>
                                <p>lorem ipsum lorn<br />lorem ipsnd, 52 lorm</p>
                              </div>
                            </div>
                          </div>

                          <div className="social-icons center">
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

                        {/* Contact Form */}
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className={`submit-button ${submitStatus ? 'submitting' : ''}`}
                  disabled={submitStatus === 'sending'}
                >
                  {submitStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    Message sent successfully!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Accent Shapes */}
      <div className="accent-shape shape1"></div>
      <div className="accent-shape shape2"></div>
      <div className="accent-shape shape3"></div>
    </div>
  );
};

export default ContactPage;