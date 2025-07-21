# 🎤 TED Talks Recommendation System using Machine Learning

A full-stack, AI-powered platform that offers personalized TED Talks recommendations based on semantic understanding of transcripts using transformer models. The system intelligently matches users with relevant TED Talks based on their watch history, interests, and interaction patterns.

---

## ✨ Features

### 👤 User-Facing Features

- 🔍 **Search & Explore** TED Talks by:
  - Title, Tags, Description
  - Categories (Innovation, Business, Design, etc.)
  - Speakers
- 🧠 **Personalized Recommendations** based on user watch history using semantic similarity.
- 📈 **Trending Talks**, **Editor's Picks**, **Hidden Gems**, **Surprise Me** mode.
- 📅 **TED Events Calendar** with upcoming/past events.
- 🎥 **Video Player Page** with full metadata and related suggestions.
- 🕵️ **Watch History** tracking:
  - View watched talks
  - Delete history entries
- ✅ **Login required** to experience personalized features and history.

---

### 🛠 Admin Panel Features

- 🔒 Protected Admin Dashboard (role-based access).
- 👥 View, manage, and delete users.
- 🚫 Block/Unblock TED Talks.
- 🧾 View individual users' watch history.
- ✅ All admin routes are protected; unauthorized users cannot access even directly.

---

## 🧱 Architecture

Client (ReactJS) <--> Node.js Express API <--> Firebase (Auth + Firestore)
|
Flask API (Python)
|
DistilBERT + Cosine Similarity

- Frontend: ReactJS (MERN-style UI)
- Backend: Node.js (REST APIs) + Flask (ML engine)
- Auth & DB: Firebase Authentication + Firestore
- Recommendation: DistilBERT embeddings + cosine similarity

---

## 💻 Tech Stack

| Layer        | Technology                                 |
|--------------|--------------------------------------------|
| Frontend     | ReactJS, HTML, Tailwind/Bootstrap (optional) |
| Backend      | Node.js, Express.js, Flask (Python)        |
| ML/NLP       | Hugging Face Transformers, DistilBERT, Scikit-learn |
| Database     | Firebase Firestore                         |
| Authentication | Firebase Auth                           |
| Deployment   | Firebase Hosting / Vercel / Heroku (optional) |

---

## 🤖 Machine Learning Approach

- **Model**: DistilBERT (for efficiency over BERT)
- **Input**: Combined fields — title + description + tags + transcript
- **Chunking**: Long transcripts split into ≤512-token chunks
- **Embedding**: [CLS] token embeddings from each chunk averaged into a 768-dim vector
- **Similarity**: Cosine similarity to recommend talks semantically close to current preferences
- **Storage**: Precomputed embeddings saved in `.pkl` files for fast access

---

## 🧩 Functional Modules

### 🏠 Homepage
- Trending TED Talks
- Personalized Recommendations
- Recently Watched
- Hidden Gems

### 🔍 Explore Page
- Tag-based discovery
- Category filters
- Editor’s picks, Surprise Me, Hidden Gems

### 📅 Events Page
- TEDx Event calendar (past & upcoming)

### 👤 Speaker Page
- View all talks by specific speakers

### 🎥 Talk Player Page
- Embedded video with related talks
- Consistent site-wide theme and UX

---

## 🔐 Security & Access Control

- ✅ All API routes are protected with Firebase JWT tokens
- 🔑 Admin Panel:
  - Access based on `isAdmin` flag in Firestore
  - Even direct URL access is blocked for non-admins
- 👥 Regular users can only access user-specific pages
- 🛡️ Role-based route protection in both frontend and backend

---

## ⚙️ Setup & Installation

### Prerequisites

- Python ≥ 3.8  
- Node.js + npm  
- Firebase project (for Auth & Firestore)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Raheelkhan-05/TedTalks.git
cd TedTalks

---

### 2. Backend Setup (Python + Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py

---

### 3. Frontend Setup (React + Node.js)
````bash
cd frontend
npm install
npm start

---

### 4. Firebase Configuration
Create a Firebase project
Enable Firestore and Authentication (Email + Google)
Add Firebase config to firebaseConfig.js

---

🔗 Key API Endpoints Examples:
Endpoint	Method	Description
/api/recommendations	POST	Get top 3 recommended TED Talks
/api/talks/trending	GET	Fetch trending talks
/api/talks/explore/:tag	GET	Explore talks by tag
/api/speakers/:name	GET	Talks by a particular speaker
/api/watch-history/:userId	GET	Get a user's watch history
/api/watch-history/:id	DELETE	Remove a video from watch history
/admin/users	GET	Admin fetch all users
/admin/blocks/:talkId	POST	Block or unblock a TED Talk (Admin only)

⚠️ All routes require Firebase JWT tokens and access control

---

🙏 Acknowledgements
TED Talks Dataset via Kaggle
Hugging Face Transformers
Firebase by Google
React, Flask, and Express communities
