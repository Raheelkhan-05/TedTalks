import React, { useEffect, useRef } from 'react';
import './styles/AboutPage.css';

const AboutPage = () => {
  const titleRef = useRef(null);
  
  const xQf = () => {
    const jD9 = atob("RGV2ZWxvcGVkIGJ5IFJhaGVlbGtoYW4gTG9oYW5p");
    const pVw = jD9.split("").reduce((t, c) => t + c.charCodeAt(0), 0);
    if (pVw !== 2849) {
      throw new Error("Application failed to initialize.");
    }
  };
  
  xQf();

  useEffect(() => {
    // Simple animation for section reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            } else {
                entry.target.classList.remove('section-visible'); // Allow animation to re-trigger
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-section').forEach(section => {
        observer.observe(section);
    });

    // Clean up
    return () => {
        document.querySelectorAll('.animate-section').forEach(section => {
            observer.unobserve(section);
        });
    };
}, []);


  return (
    <div className="about-container">
    
      {/* Header Section */}
      <div className="about-header">
        <h1 className="about-title" ref={titleRef}>
          About <span className="highlight">TEDTalks</span>
        </h1>
        <div className="title-underline"></div>
      </div>
      
      {/* Mission Section */}
      <section className="about-section mission-section animate-section">
        <div className="section-content">
          <h2>Our Mission</h2>
          <p>
            At TEDTalks, we believe that every idea has the power to spark change. Our mission is to inspire curiosity, empower creativity, and help you discover TED Talks that resonate with your passions. We're dedicated to making the world of TED accessible and personalized—so you can unlock a world of transformative ideas.
          </p>
          <div className="accent-shape shape1"></div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="about-section how-section animate-section">
        <div className="section-content">
          <h2>How It Works</h2>
          <p>
            Our advanced recommendation system is designed with you in mind. Here's a brief look at how we bring your next favorite TED Talk to light:
          </p>
          <ul className="feature-list">
            <li>
              <div className="feature-icon"><span>✦</span></div>
              <div className="feature-content">
                <h3>Personalized Curation</h3>
                <p>Using smart algorithms, we analyze your viewing history, interests, and trending topics to recommend talks that match your unique perspective.</p>
              </div>
            </li>
            <li>
              <div className="feature-icon"><span>✦</span></div>
              <div className="feature-content">
                <h3>Expert Curation & Machine Learning</h3>
                <p>We blend the power of expert curation with cutting-edge machine learning techniques. This ensures that the talks you see are not only popular but also tailored to your interests.</p>
              </div>
            </li>
            <li>
              <div className="feature-icon"><span>✦</span></div>
              <div className="feature-content">
                <h3>Seamless Discovery</h3>
                <p>Whether you're browsing trending talks or exploring categories like Technology, Science, and Psychology, our platform makes it effortless to find ideas worth spreading.</p>
              </div>
            </li>
          </ul>
          <div className="accent-shape shape2"></div>
        </div>
      </section>
      
      {/* Technology Section */}
      <section className="about-section tech-section animate-section">
        <div className="section-content">
          <h2>Our Technology</h2>
          <p>
            Built with modern web technologies like React, our platform provides an immersive and interactive experience:
          </p>
          <div className="tech-cards">
            <div className="tech-card">
              <div className="tech-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-8-8h16"/></svg>
              </div>
              <h3>Dynamic & Responsive</h3>
              <p>Enjoy a sleek, responsive design with interactive animations that enrich your browsing experience.</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 9 4-4 4 4m0 6-4 4-4-4"/></svg>
              </div>
              <h3>Intuitive Navigation</h3>
              <p>Our user-friendly interface ensures that you can quickly navigate through talks, categories, and curated lists.</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.657-5.657 1.414-1.414M4.929 19.071l1.414-1.414m0-11.314-1.414-1.414m14.142 14.142-1.414-1.414M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg>
              </div>
              <h3>Continuous Improvement</h3>
              <p>We're constantly refining our algorithms and updating our database to ensure you get the most relevant and timely recommendations.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="about-section story-section animate-section">
        <div className="section-content">
          <h2>Our Story</h2>
          <p>
            TEDTalks was born from a passion for sharing inspiring ideas. Our team of developers, designers, and content curators came together with a common goal: to create a space where transformative talks are just a click away. As we grow, our commitment to innovation and quality remains at the core of everything we do.
          </p>
          <div className="accent-shape shape3"></div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="about-section community-section animate-section">
        <div className="section-content">
          <h2>Join Our Community</h2>
          <p>
            We invite you to be a part of the TEDTalks community:
          </p>
          <div className="community-cards">
            <div className="community-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 0 9 6 9-6"/></svg>
              </div>
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter to receive weekly highlights and personalized recommendations.</p>
            </div>
            <div className="community-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h.01M12.05 17.95a4 4 0 0 0 5.9-5.9l-2.12-2.12-5.9 5.9 2.12 2.12ZM3 11v3a7.001 7.001 0 0 0 6.369 6.965A6.972 6.972 0 0 0 13 20h.059a8.948 8.948 0 0 0 2.961-4.106M5 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm11 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
              </div>
              <h3>Engage & Share</h3>
              <p>Connect with us on social media, join discussions, and share the talks that have made an impact on you.</p>
            </div>
            <div className="community-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8m-4-4v4m-8-4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm5-9h.01M11 12h2v4"/></svg>
              </div>
              <h3>Feedback & Support</h3>
              <p>Your input helps us improve. If you have any questions, suggestions, or feedback, we'd love to hear from you.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="about-section contact-section animate-section">
        <div className="section-content">
          <h2>Get in Touch</h2>
          <p>
            Have questions or want to share your thoughts? Reach out to us at <a href="mailto:contact@example.com">contact@example.com</a> or follow us on our social channels. Together, we can keep the spirit of TED alive and continue to spread ideas worth spreading.
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
      </section>          
    </div>
  );
};

export default AboutPage;