import React, { useEffect, useRef } from 'react';
import './styles/PrivacyPolicy.css';

const PrivacyPolicy = () => {
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
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('pp-section-visible');
        } else {
          entry.target.classList.remove('pp-section-visible'); // Allow animation to re-trigger
        }
      });
    }, observerOptions);

    document.querySelectorAll('.pp-animate-section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('.pp-animate-section').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="pp-privacy-container">
  <div className="pp-privacy-header">
    <h1 className="pp-privacy-title" ref={titleRef}>
      Privacy <span className="pp-highlight">Policy</span>
    </h1>
    <div className="pp-title-underline"></div>
    <p className="pp-effective-date">Effective Date: February 22, 2025</p>
  </div>

  <section className="pp-privacy-section pp-animate-section">
    <div className="pp-section-content">
      <p className="pp-intro-text">
        At <strong>TedTalks Recommender System</strong>, we are committed to protecting your privacy.
      </p>
    </div>
  </section>

  {policyData.map((section, index) => (
    <section key={index} className="pp-privacy-section pp-animate-section">
      <div className="pp-section-content">
        <h2>{section.title}</h2>
        {section.content.map((item, i) => (
          <div key={i} className="pp-policy-item">
            {item.subtitle && <h3>{item.subtitle}</h3>}
            {item.text && <p>{item.text}</p>}
            {item.list && (
              <ul>
                {item.list.map((listItem, j) => (
                  <li key={j}>{listItem}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  ))}

    {/* Contact Section */}
    <section className="faq-contact-section pp-animate-section">
        <div className="section-content">
          <h2>Still have questions?</h2>
          <p>
            We're here to help! Contact our support team at{' '}
            <a href="mailto:support@tedtalks.com">sample@sample.com</a>
          </p>
        </div>
      </section>
  

  <div className="pp-accent-shape pp-shape1"></div>
  <div className="pp-accent-shape pp-shape2"></div>
  <div className="pp-accent-shape pp-shape3"></div>
</div>

)};

// Policy content data structure
const policyData = [
    {
      "title": "1. Information We Collect",
      "content": [
        {
          "list": [
            "Personal Information: When you register an account, we collect your name, email address, and selected categories of interest.",
            "Usage Data: We track interactions such as watched talks, likes, search queries, and feedback to improve our recommendation system."
          ]
        }
      ]
    },
    {
      "title": "2. How We Use Your Information",
      "content": [
        {
          "list": [
            "Personalized Recommendations: To provide tailored TED Talk suggestions using our AI-powered hybrid recommendation system.",
            "Platform Improvement: To enhance user experience by analyzing usage patterns and optimizing content delivery.",
            "Communication: To send important notifications, updates, and promotional content related to TED Talks (only if you opt-in).",
            "Security: To protect user data, prevent unauthorized access, and maintain platform integrity."
          ]
        }
      ]
    },
    {
      "title": "3. Information Sharing and Disclosure",
      "content": [
        {
          "list": [
            "Service Providers: We may share data with trusted service providers (e.g., hosting and analytics platforms) who help us operate the platform.",
            "Legal Obligations: We may disclose information if required by law or to protect our rights and the safety of users."
          ]
        }
      ]
    },
    {
      "title": "4. Cookies and Tracking Technologies",
      "content": [
        {
          "list": [
            "We use cookies and similar tracking technologies to enhance user experience, remember preferences, and analyze platform performance.",
            "You can adjust cookie settings through your browser preferences."
          ]
        }
      ]
    },
    {
      "title": "5. Data Security",
      "content": [
        {
          "list": [
            "We implement industry-standard security measures to protect your data from unauthorized access, alteration, or misuse.",
            "However, no online platform is completely secure, and users should take precautions when sharing personal information."
          ]
        }
      ]
    },
    {
      "title": "6. Your Rights and Choices",
      "content": [
        {
          "list": [
            "Access and Correction: You can access and update your personal information through contacting us.",
            "Data Deletion: You may request the deletion of your account and associated data by contacting our support team.",
            "Opt-Out: You can opt-out of promotional emails by adjusting your notification preferences or clicking the unsubscribe link in emails."
          ]
        }
      ]
    },
    {
      "title": "7. Changes to This Privacy Policy",
      "content": [
        {
          "list": [
            "We may update this Privacy Policy periodically to reflect changes in our practices.",
            "Users will be notified of significant updates via email or platform notifications."
          ]
        }
      ]
    }
  ];  

export default PrivacyPolicy;