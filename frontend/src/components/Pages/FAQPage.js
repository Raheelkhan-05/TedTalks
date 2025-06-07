import React, { useEffect, useRef, useState } from 'react';
import './styles/FAQPage.css';

const FAQPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const titleRef = useRef(null);

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

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "What is TedTalks?",
      answer: "TedTalks is a MERN web application designed to recommend TED Talks based on your interests. Using advanced machine learning techniques, it provides personalized suggestions to help you discover inspiring talks from thought leaders worldwide."
    },
    {
      question: "How does the recommendation system work?",
      answer: "The system uses a hybrid approach combining content-based filtering and collaborative filtering. It analyzes talk transcripts, titles, and tags using DistilBERT embeddings and ranks recommendations based on content similarity and popularity metrics."
    },
    {
      question: "How do I get personalized recommendations?",
      answer: "When you register, you can select your preferred categories. As you watch, like, and interact with talks, the system continuously improves its recommendations to match your interests."
    },
    {
      question: "Can I search for specific TED Talks?",
      answer: "Yes, you can search for TED Talks using titles, keywords, or categories. The system also handles minor spelling mistakes to ensure accurate results."
    },
    {
      question: "What features does the platform offer?",
      answer: "Our platform offers multiple features including: Personalized TED Talk recommendations, Search functionality with spell-check, A user feedback mechanism to refine recommendations, Topic clustering for better categorization, and An interactive leaderboard of trending talks."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we prioritize user privacy and ensure that your interaction data is securely stored and used only to enhance your experience."
    },
    {
      question: "Can I use the platform without creating an account?",
      answer: "Yes, you can explore and watch TED Talks without an account. However, creating an account allows you to receive personalized recommendations and save your favorite talks."
    },
    {
      question: "How is the recommendation accuracy measured?",
      answer: "The system is evaluated using metrics such as tag overlap accuracy, semantic similarity scores, and real-world usability tests. The current system has achieved 99.97% training accuracy and 99.89% testing accuracy."
    },
    {
      question: "Who can I contact for support?",
      answer: "For any issues or inquiries, please contact our support team at support@tedtalks.com."
    }
  ];

  return (
    <div className="faq-container">
      {/* Header Section */}
      <div className="faq-header">
        <h1 className="faq-title" ref={titleRef}>
          Frequently Asked <span className="highlight">Questions</span>
        </h1>
        <div className="title-underline"></div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section animate-section">
        <div className="section-content">
          <div className="faq-list">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeQuestion === index ? 'active' : ''}`}
                onClick={() => toggleQuestion(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <div className="faq-icon">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="faq-contact-section animate-section">
        <div className="section-content">
          <h2>Still have questions?</h2>
          <p>
            We're here to help! Contact our support team at{' '}
            <a href="mailto:support@tedtalks.com">support@tedtalks.com</a>
          </p>
        </div>
      </section>

      {/* Accent Shapes */}
      <div className="accent-shape shape1"></div>
      <div className="accent-shape shape2"></div>
      <div className="accent-shape shape3"></div>
    </div>
  );
};

export default FAQPage;