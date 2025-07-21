# 🎤 TED Talks Recommendation System
A full-stack, AI-powered platform that offers personalized TED Talks recommendations based on semantic understanding of transcripts using transformer models. The system intelligently matches users with relevant TED Talks based on their watch history, interests, and interaction patterns.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Machine Learning Approach](#-machine-learning-approach)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Acknowledgements](#-acknowledgements)

## ✨ Features

### 👤 User-Facing Features

- **🔍 Advanced Search & Explore**
  - Search by title, tags, description, and speakers
  - Category-based filtering (Innovation, Business, Design, etc.)
  - Tag-based discovery system
  
- **🧠 Personalized AI Recommendations**
  - Semantic similarity-based suggestions using DistilBERT
  - Machine learning-powered content matching
  - Recommendations based on watch history and user preferences
  
- **📈 Content Discovery**
  - Trending Talks
  - Editor's Picks
  - Hidden Gems
  - "Surprise Me" mode for random discovery
  
- **📅 Events & Calendar**
  - TEDx Event calendar with upcoming and past events
  - Event-based talk categorization
  
- **🎥 Enhanced Viewing Experience**
  - Integrated video player with full metadata
  - Related talk suggestions
  - Watch progress tracking
  
- **🕵️ Personal Dashboard**
  - Complete watch history tracking
  - History management (view/delete entries)
  - Personalized user experience

> **Note:** Login is required to access personalized features and maintain watch history.

### 🛠 Admin Panel Features

- **🔒 Secure Admin Dashboard**
  - Role-based access control
  - Protected routes with unauthorized access prevention
  
- **👥 User Management**
  - View and manage all registered users
  - User account administration
  - Individual user watch history monitoring
  
- **🎥 Content Moderation**
  - Block/Unblock TED Talks
  - Content management and curation
  - System-wide content control

## 🧱 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client        │    │   Node.js        │    │   Firebase      │
│   (ReactJS)     │◄──►│   Express API    │◄──►│   Auth +        │
│                 │    │                  │    │   Firestore     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Flask API      │
                       │   (Python)       │
                       └──────────────────┘
                                │
                                ▼
                       ┌───────────────────┐
                       │   DistilBERT +    │
                       │ Cosine Similarity │
                       └───────────────────┘
```

**Architecture Flow:**
- **Frontend:** ReactJS provides the user interface
- **Backend:** Node.js handles API requests and business logic
- **ML Engine:** Flask serves machine learning recommendations
- **Database & Auth:** Firebase handles authentication and data storage
- **AI:** DistilBERT processes semantic understanding for recommendations

## 💻 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | ReactJS, HTML, CSS/Tailwind | User interface and experience |
| **Backend API** | Node.js, Express.js | REST API server and business logic |
| **ML Engine** | Flask (Python) | Machine learning recommendation engine |
| **NLP/AI** | Hugging Face Transformers, DistilBERT | Natural language processing and embeddings |
| **ML Libraries** | Scikit-learn, NumPy, Pandas | Data processing and similarity calculations |
| **Database** | Firebase Firestore | NoSQL document database |
| **Authentication** | Firebase Auth | User authentication and authorization |
| **Deployment** | Firebase Hosting, Vercel, Heroku | Cloud hosting and deployment |

## 🤖 Machine Learning Approach

### Model Architecture
- **Primary Model:** DistilBERT (Distilled BERT)
  - Chosen for efficiency while maintaining high accuracy
  - 66M parameters vs BERT's 110M parameters
  - 97% of BERT's performance with 60% size reduction

### Data Processing Pipeline
1. **Input Preparation:** Combines title + description + tags + transcript
2. **Text Chunking:** Long transcripts split into ≤512-token chunks to fit model constraints
3. **Embedding Generation:** 
   - Extract [CLS] token embeddings from each chunk
   - Average chunk embeddings into single 768-dimensional vector
4. **Similarity Calculation:** Cosine similarity for semantic matching
5. **Storage Optimization:** Precomputed embeddings stored in `.pkl` files for fast retrieval


## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Raheelkhan-05/TedTalks.git
cd TedTalks
```

### 2. Backend Setup (Python Flask)

```bash
# Navigate to backend directory
cd model

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The Flask server will run on `http://localhost:5000`

### 3. Frontend Setup (React + Node.js)

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm start
```

The React app will run on `http://localhost:3000`

### 4. Node.js API Server Setup

```bash
# Navigate to API directory (if separate)
cd backend

# Install dependencies
npm install

# Start the server
node server.js
```


## 🎯 Usage

### For Regular Users

1. **Registration/Login:**
   - Create account or login with email/Google
   - Access personalized features after authentication

2. **Discover Content:**
   - Browse trending talks on homepage
   - Use search functionality to find specific content
   - Explore categories and tags
   - Try "Surprise Me" for random discoveries

3. **Get Recommendations:**
   - Watch TED Talks to build your preference profile
   - Receive AI-powered personalized recommendations
   - View recommendations on homepage and talk pages

4. **Manage History:**
   - Track your viewing history
   - Remove unwanted entries from history
   - Use history to improve future recommendations

### For Administrators

1. **Access Admin Panel:**
   - Login with admin-enabled account
   - Navigate to `/admin` route

2. **User Management:**
   - View all registered users
   - Monitor user activity and watch histories
   - Manage user accounts

3. **Content Moderation:**
   - Block inappropriate or outdated talks
   - Manage content visibility
   - Curate editor's picks and featured content

## 📚 API Documentation

### Authentication
All API endpoints require Firebase JWT tokens in the Authorization header:

### Some Core Endpoints
#### User Endpoints
```http
GET /api/talks/trending
GET /api/talks/explore/:tag
GET /api/speakers/:name
```

#### Watch History
```http
GET /api/watch-history/:userId
POST /api/watch-history
DELETE /api/watch-history/:id
```

#### Admin Endpoints (Admin Only)
```http
GET /admin/users
GET /admin/user-history/:userId
POST /admin/blocks/:talkId
DELETE /admin/users/:userId
```


## 🤝 Contributing

We welcome contributions to improve the TED Talks Recommendation System! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Areas for Contribution
- **Frontend:** UI/UX improvements, new features
- **Backend:** API optimization, new endpoints
- **ML:** Recommendation algorithm improvements
- **Documentation:** Tutorials, API docs, code comments
- **Testing:** Unit tests, integration tests
- **DevOps:** Deployment automation, monitoring

## 🙏 Acknowledgements

We extend our gratitude to the following:

- **[TED Talks Dataset](https://www.kaggle.com/datasets/rounakbanik/ted-talks)** - Comprehensive dataset from Kaggle
- **[Hugging Face Transformers](https://huggingface.co/transformers/)** - State-of-the-art NLP models and tools
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service platform by Google
- **[React Community](https://reactjs.org/)** - Amazing frontend framework and ecosystem
- **[Flask Community](https://flask.palletsprojects.com/)** - Lightweight and flexible Python web framework
- **[Express.js Community](https://expressjs.com/)** - Fast, unopinionated web framework for Node.js

---

<div align="center">

**Made with ❤️ by [Raheelkhan](https://github.com/Raheelkhan-05)**

*If you found this project helpful, please consider giving it a ⭐ on GitHub!*

</div>
