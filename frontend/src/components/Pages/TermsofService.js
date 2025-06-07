import React, { useEffect, useRef } from 'react';
import './styles/TermsOfService.css';

const TermsOfService = () => {
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
          entry.target.classList.add('tos-section-visible');
        } else {
          entry.target.classList.remove('tos-section-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.tos-animate-section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('.tos-animate-section').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="tos-container">
      <div className="tos-header">
        <h1 className="tos-title" ref={titleRef}>
          Terms of <span className="tos-highlight">Service</span>
        </h1>
        <div className="tos-title-underline"></div>
        <p className="tos-effective-date">Effective Date: February 22, 2025</p>
      </div>

      {termsData.map((section, index) => (
        <section key={index} className="tos-section tos-animate-section">
          <div className="tos-section-content">
            <h2>{section.title}</h2>
            {section.content.map((item, i) => (
              <div key={i} className="tos-item">
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

      <section className="faq-contact-section tos-animate-section">
        <div className="section-content">
          <h2>Still have questions?</h2>
          <p>
            We're here to help! Contact our support team at{' '}
            <a href="mailto:support@tedtalks.com">support@tedtalks.com</a>
          </p>
        </div>
      </section>

      <div className="tos-accent-shape tos-shape1"></div>
      <div className="tos-accent-shape tos-shape2"></div>
      <div className="tos-accent-shape tos-shape3"></div>
    </div>
  );
};

const termsData = [
  {
    title: "1. Acceptance of Terms",
    content: [
      {
        text: "By accessing or using the TedTalks website (\"Platform\") and its related services (\"Services\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree with these Terms, please do not use the Platform."
      }
    ]
  },
  {
    title: "2. Description of Service",
    content: [
      {
        text: "TedTalks is a MERN-based web application that offers users a curated collection of TED Talks along with personalized recommendations. Our Services utilize advanced AI-driven algorithms to analyze content and user preferences, delivering tailored suggestions and interactive features to enhance your viewing experience."
      }
    ]
  },
  {
    title: "3. User Accounts and Registration",
    content: [
      {
        list: [
          "Account Creation: Certain features of our Platform require you to create an account. When registering, you agree to provide accurate, current, and complete information.",
          "Security: You are responsible for safeguarding your account credentials. Any activity under your account is your responsibility.",
          "Eligibility: You must be at least 13 years old to create an account. By registering, you confirm that you meet this age requirement."
        ]
      }
    ]
  },
  {
    title: "4. User Conduct",
    content: [
      {
        list: [
          "Lawful Use: You agree to use the Platform only for lawful purposes and in accordance with these Terms.",
          "Prohibited Activities: You must not misuse our Services by engaging in activities such as unauthorized data access, spamming, or attempting to disrupt the functionality of the Platform."
        ]
      }
    ]
  },
  {
    title: "5. Content and Intellectual Property",
    content: [
      {
        list: [
          "Ownership: All content available on TedTalks, including but not limited to text, graphics, logos, images, videos, and software, is owned by TedTalks or its licensors.",
          "Usage Restrictions: You may view and share content for personal, non-commercial purposes only. Any reproduction, modification, distribution, or public display of our content without express written permission is prohibited.",
          "Third-Party Content: TED Talk videos and related materials may be subject to additional terms imposed by TED Conferences. Your use of such content is governed by those terms."
        ]
      }
    ]
  },
  {
    title: "6. Data Collection and Privacy",
    content: [
      {
        text: "Your use of our Platform is also governed by our Privacy Policy, which details the information we collect (such as personal information, usage data, and device information), how we use it for personalized recommendations and platform improvements, and the measures we take to safeguard your data."
      }
    ]
  },
  {
    title: "7. Disclaimer of Warranties",
    content: [
      {
        list: [
          "'As Is' Basis: The Platform and Services are provided on an 'as is' and 'as available' basis without any warranties of any kind, whether express or implied.",
          "No Guarantees: We do not guarantee uninterrupted access or that the Platform will be free from errors, bugs, or security breaches. Your use of our Services is at your sole risk."
        ]
      }
    ]
  },
  {
    title: "8. Limitation of Liability",
    content: [
      {
        text: "In no event will TedTalks, its affiliates, or its licensors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Platform. Our aggregate liability for any claims related to your use of our Services shall not exceed the amount, if any, that you have paid to access the Services."
      }
    ]
  },
  {
    title: "9. Changes to the Terms",
    content: [
      {
        text: "We reserve the right to modify these Terms at any time. Significant changes will be communicated through updates on the Platform or via email. Continued use of the Platform following any modifications constitutes your acceptance of the revised Terms."
      }
    ]
  },
  {
    title: "10. Termination",
    content: [
      {
        text: "We may suspend or terminate your access to the Platform at our discretion, without prior notice, if you violate these Terms or if we believe your actions could harm our Services, other users, or the integrity of the Platform. Upon termination, your right to use the Services will immediately cease."
      }
    ]
  },
  {
    title: "11. Governing Law",
    content: [
      {
        text: "These Terms are governed by and construed in accordance with the laws of the jurisdiction in which TedTalks operates, without regard to its conflict of laws principles."
      }
    ]
  }
];

export default TermsOfService;