import React, { useEffect, useState } from 'react';
import './styles/HomePage.css';
import heroImage from './img/hero.png';
import i1 from './img/i1.webp';
import i2 from './img/i2.jpg';
import i3 from './img/i3.jpg';
import i4 from './img/i4.webp';
import { Link } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase auth
import TrendingSection from '../TrendingHome';
import { useNavigate } from "react-router-dom";
import SearchBar from '../SearchBar';

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [inputQuery, setInputQuery] = useState("");
  
      const handleSearch = () => {
          if (inputQuery.trim()) {
              navigate(`/search-results?query=${encodeURIComponent(inputQuery)}`);
          }
      };
  

  // const handleCategoryClick = (categoryId) => {
  //   navigate("/categories", { state: { selectedCategory: categoryId } });
  // };
  
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("User is logged in:", user); // Debugging line
      setUserName(user.displayName || user.email.split('@')[0]);
    } else {
      console.log("No user is logged in"); // Debugging line
    }
  }, []);

  // Intersection Observer to reveal sections on scroll
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

    const animatedSections = document.querySelectorAll('.tos-animate-section');
    animatedSections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      animatedSections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

//   const handleSearch = () => {
//     if (query.trim()) {
//         navigate(`/search-results?query=${encodeURIComponent(query)}`);
//     }
// };

  const xQf = () => {
    const jD9 = atob("RGV2ZWxvcGVkIGJ5IFJhaGVlbGtoYW4gTG9oYW5p");
    const pVw = jD9.split("").reduce((t, c) => t + c.charCodeAt(0), 0);
    if (pVw !== 2849) {
      throw new Error("Application failed to initialize.");
    }
  };

  // Other animations (dots, hero image effects, etc.)
  useEffect(() => {
    const dotsContainer = document.getElementById("dotsBackground");
    const numberOfDots = 100;

    if (dotsContainer) {
      for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");

        const size = Math.random() * 3 + 1;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;

        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;

        dot.style.opacity = Math.random() * 0.2;

        const depth = Math.random() * 3;
        dot.setAttribute("data-depth", depth);

        dotsContainer.appendChild(dot);
      }
    }

    const handleMouseMove = (e) => {
      const dots = document.querySelectorAll(".dot");
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      dots.forEach((dot) => {
        const depth = parseFloat(dot.getAttribute("data-depth"));
        const moveX = (mouseX - 0.5) * depth * 20;
        const moveY = (mouseY - 0.5) * depth * 20;

        dot.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      const heroImageElem = document.querySelector(".hero-image");
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const moveXHero = (e.clientX - windowWidth / 2) / 15;
      const moveYHero = (e.clientY - windowHeight / 2) / 15;

      if (heroImageElem && windowWidth > 992) {
        heroImageElem.style.transform = `rotateY(${-15 + moveXHero * -0.1}deg) rotateX(${5 + moveYHero * 0.2}deg)`;
      }
    };

    xQf();

    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 50) {
          header.style.backgroundColor = "rgba(10, 10, 10, 0.95)";
          header.style.backdropFilter = "blur(10px)";
          header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.5)";
        } else {
          header.style.backgroundColor = "rgba(20, 20, 20, 0.9)";
          header.style.backdropFilter = "blur(8px)";
          header.style.boxShadow = "none";
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="home-container">
      {/* Greeting
      
      {userName &&
       <div className="greeting">Hello, {userName}!</div>
       } */}
      
      {/* Background Elements */}
      <div className="background-container">
        <div className="bg-element orb orb-1"></div>
        <div className="bg-element orb orb-2"></div>
        <div className="bg-element orb orb-3"></div>
        <div className="bg-element grid-background"></div>
        <div className="bg-element shapes-container">
          <div className="shape shape-circle"></div>
          <div className="shape shape-triangle"></div>
          <div className="shape shape-square"></div>
          <div className="shape shape-rect"></div>
        </div>
        <div className="bg-element dots-background" id="dotsBackground"></div>
        <div className="bg-element lines-container">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section" style={{marginTop: '2rem'}}>
        <div className="hero-content">
          <h1>Discover Your Next TED Talk</h1>
          <p>Unlock Inspiration, One TED Talk at a Time</p>
          <div className="search-bar">
            <input
                type="text"
                placeholder="Search for inspiring TED Talks..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Explore Now</button>
        </div>
          {/* <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search TED Talks..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch}>Explore Now</button>
            </div> */}
        </div>
        <div className="hero-3d-effect">
          <div className="hero-image">
            <img src={heroImage} height={800} width={600} alt="TED Talk speaker on stage" />
          </div>
        </div>
      </section>

      {/* Trending Talks Section */}
      <TrendingSection />

      {/* <section className="trending-section tos-animate-section">
        <div className="section-header">
          <h2>Trending Talks</h2>
          <p>Discover the most influential ideas spreading globally</p>
        </div>
        <div className="trending-cards">
          <div className="talk-card">
            <span className="talk-time">18:24</span>
            <img src={i1} height={400} width={300} alt="The Future of AI" />
            <div className="play-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="talk-info">
              <h3>The Future of AI</h3>
              <p>Jane Doe</p>
            </div>
          </div>

          <div className="talk-card">
            <span className="talk-time">21:09</span>
            <img src={i2} height={400} width={300} alt="Inspiration and Innovation" />
            <div className="play-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="talk-info">
              <h3>Inspiration and Innovation</h3>
              <p>John Smith</p>
            </div>
          </div>

          <div className="talk-card">
            <span className="talk-time">15:47</span>
            <img src={i3} height={400} width={300} alt="Designing the Future" />
            <div className="play-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="talk-info">
              <h3>Designing the Future</h3>
              <p>Alice Johnson</p>
            </div>
          </div>

          <div className="talk-card">
            <span className="talk-time">19:32</span>
            <img src={i4} height={400} width={300} alt="Unlocking Creativity" />
            <div className="play-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="talk-info">
              <h3>Unlocking Creativity</h3>
              <p>Robert Brown</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Categories Section */}
      <section className="categories-section tos-animate-section">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <p>Discover talks that match your interests</p>
        </div>
        <div className="categories-cards">
        {[
          { id: "technology", icon: "🧠", title: "Technology", description: "Explore AI, robotics, and digital innovation." },
          { id: "science", icon: "🌍", title: "Science", description: "Groundbreaking research and scientific discoveries." },
          { id: "business", icon: "📈", title: "Business", description: "Leadership, market trends, and entrepreneurship." }
        ].map(category => (
          <div className="category-card" key={category.id}>
            <div className="category-icon">{category.icon}</div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <Link
              to={`/categories?tag=${category.id}`} style={{textTransform: "capitalize"}}
            >
            <button className="explore-button" >
              Explore
            </button>
            </Link>
          </div>
        ))}
        </div>
      </section>


      {/* Newsletter Section */}
      <section className="newsletter-section tos-animate-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2>Get Weekly Inspiration</h2>
            <p>
              Join our community and receive curated TED talks based on your interests directly to your inbox every week.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
          <div className="newsletter-3d-element">
            <div className="floating-cubes">
              <div className="cube"></div>
              <div className="cube"></div>
              <div className="cube"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;