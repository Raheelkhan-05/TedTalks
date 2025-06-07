const express = require("express");
const axios = require("axios");
const cors = require("cors");
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

const FLASK_API = "http://127.0.0.1:5000";  // Flask server URL

// API endpoint to update user password
// Password update endpoint
app.post('/api/update_password', async (req, res) => {
    try {
      const { adminEmail, adminUid, userEmail, newPassword } = req.body;
      
      // Verify the admin user exists and has admin privileges
      const adminEmail_formatted = adminEmail.replace(/\./g, "_");
      const adminDocRef = admin.firestore().collection('users').doc(adminEmail_formatted);
      const adminDoc = await adminDocRef.get();
      
      if (!adminDoc.exists || !adminDoc.data().isAdmin) {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized. Admin privileges required.' 
        });
      }
      
      // Get the user by email
      const userRecord = await admin.auth().getUserByEmail(userEmail);
      
      // Update the user's password in Firebase Auth
      await admin.auth().updateUser(userRecord.uid, {
        password: newPassword
      });
      
      // Return success
      return res.json({ success: true });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
var serviceAccount = require("./ttsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

// Utility function to filter out blocked talks
// Utility function to filter out blocked talks
const filterBlockedTalks = async (talks, isAdmin = false) => {
    // Return empty array if talks is undefined
    if (!talks) return [];
    
    // Return all talks for admin
    if (isAdmin) return talks; 
    
    try {
      const blockedTalksSnapshot = await db.collection('blockedTalks').get();
      const blockedTalkIds = blockedTalksSnapshot.docs.map(doc => doc.id);
      
      // Filter out blocked talks
      return talks.filter(talk => !blockedTalkIds.includes(talk.talk__id?.toString()));
    } catch (error) {
      console.error("Error filtering blocked talks:", error);
      return talks; // Return original talks if there's an error
    }
  };

// Check for admin status from request
const isAdminRequest = (req) => {
  return req.query.admin === 'true' || req.headers['x-admin'] === 'true';
};

// API Route to Fetch Trending Talks
app.get("/api/trending", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API}/trending`);
    const isAdmin = isAdminRequest(req);
    const filteredTalks = await filterBlockedTalks(response.data.talks, isAdmin);
    res.json({ ...response.data, talks: filteredTalks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route to Fetch All Talks
app.get("/api/all_talks", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API}/all_talks`);
    const isAdmin = isAdminRequest(req);
    const filteredTalks = await filterBlockedTalks(response.data.talks, isAdmin);
    res.json({ ...response.data, talks: filteredTalks });
  } catch (error) {
    console.error("Error fetching TED Talks:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Shuffle array utility function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

// API Route for Recommendations
app.post("/api/recommendations", async (req, res) => {
  try {
    console.log("📥 Received request:", req.body);

    const { watched_talks } = req.body;

    if (!watched_talks || watched_talks.length === 0) {
      console.warn("⚠️ No watched talks provided!");
      return res.status(400).json({ error: "No watched talks provided" });
    }

    console.log("🚀 Sending data to Flask:", { watched_talks });

    // Send request to Flask API
    const response = await axios.post(`${FLASK_API}/recommendations`, { watched_talks });
    
    console.log("✅ Flask Response:", response.data);

    // Filter out blocked talks
    const isAdmin = isAdminRequest(req);
    const filteredTalks = await filterBlockedTalks(response.data.talks, isAdmin);
    
    // Shuffle recommendations before sending
    const shuffledTalks = shuffleArray(filteredTalks);

    res.json({ talks: shuffledTalks });
  } catch (error) {
    console.error("🔥 Error fetching recommendations:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Route to Fetch Speakers
app.get("/api/speakers", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API}/speakers`);
    res.json(response.data); // No talks to filter here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route to Fetch Trending Talks for Homepage
app.get("/api/trendinghome", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API}/trendinghome`);
    const isAdmin = isAdminRequest(req);
    const filteredTalks = await filterBlockedTalks(response.data.talks, isAdmin);
    res.json({ ...response.data, talks: filteredTalks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route to Fetch TED Talk by ID
app.get("/api/talk/:talkId", async (req, res) => {
  const { talkId } = req.params;
  try {
    // Check if talk is blocked
    const talkRef = db.collection('blockedTalks').doc(talkId.toString());
    const talkDoc = await talkRef.get();
    
    if (talkDoc.exists && !isAdminRequest(req)) {
      // Talk is blocked and requester is not admin
      return res.status(403).json({ 
        error: "This talk has been blocked by the administrator" 
      });
    }
    
    // Proceed with fetching talk details
    const response = await axios.get(`${FLASK_API}/api/talk/${talkId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch events (upcoming/past)
app.get("/api/events", async (req, res) => {
  try {
    const { type, page } = req.query;
    const response = await axios.get(`${FLASK_API}/events?type=${type}&page=${page}`);
    res.json(response.data); // Events don't need filtering
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Fetch top 7 topics + all topics
app.get("/api/top_topics", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API}/top_topics`);
    res.json(response.data); // Topics don't need filtering
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch TED Talks by topic
app.get("/api/talks_by_topic", async (req, res) => {
    try {
      const topic = req.query.topic || "all";  // Default to "all"
      const response = await axios.get(`${FLASK_API}/talks_by_topic?topic=${topic}`);
      const isAdmin = isAdminRequest(req);
      
      // Carefully handle response data
      if (response.data && response.data.talks && Array.isArray(response.data.talks)) {
        const filteredTalks = await filterBlockedTalks(response.data.talks, isAdmin);
        res.json({ ...response.data, talks: filteredTalks });
      } else {
        // If talks is not an array or doesn't exist, return the original response
        res.json(response.data);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Route to fetch Hidden Gems
  app.get("/api/hidden_gems", async (req, res) => {
    try {
      const response = await axios.get(`${FLASK_API}/hidden_gems?top_k=4`);
      const isAdmin = isAdminRequest(req);
      
      // Carefully handle response data
      if (response.data && response.data.talks && Array.isArray(response.data.talks)) {
        const filteredTalks = await filterBlockedTalks(response.data.talks, isAdmin);
        res.json({ ...response.data, talks: filteredTalks });
      } else {
        // If talks is not an array or doesn't exist, return the original response
        res.json(response.data);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Route to fetch a random TED Talk
  app.get("/api/random_talk", async (req, res) => {
    try {
      const response = await axios.get(`${FLASK_API}/random_talk?count=5`);
      const isAdmin = isAdminRequest(req);
      
      // Handle the case where talk might be a single object or an array
      if (response.data && response.data.talk) {
        if (Array.isArray(response.data.talk)) {
          // If talk is an array, filter it
          if (response.data.talk.length > 0) {
            const filteredTalks = await filterBlockedTalks(response.data.talk, isAdmin);
            
            if (filteredTalks.length > 0) {
              // Select a random talk from filtered talks
              const randomIndex = Math.floor(Math.random() * filteredTalks.length);
              res.json({ talk: filteredTalks[randomIndex] });
            } else {
              res.json({ talk: null, message: "No available talks after filtering" });
            }
          } else {
            res.json({ talk: null, message: "No talks received from API" });
          }
        } else {
          // If talk is a single object
          const talkId = response.data.talk.talk__id ? response.data.talk.talk__id.toString() : null;
          
          if (talkId && !isAdmin) {
            // Check if this single talk is blocked
            const talkRef = db.collection('blockedTalks').doc(talkId);
            const talkDoc = await talkRef.get();
            
            if (talkDoc.exists) {
              res.json({ talk: null, message: "This talk has been blocked" });
            } else {
              res.json(response.data);
            }
          } else {
            res.json(response.data);
          }
        }
      } else {
        // If no talk data, return the original response
        res.json(response.data);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Route to fetch Editor's Picks
  app.get("/api/editors_picks", async (req, res) => {
    try {
      const response = await axios.get(`${FLASK_API}/editors_picks?top_k=9`);
      const isAdmin = isAdminRequest(req);
      
      // Carefully handle response data
      if (response.data && response.data.talks && Array.isArray(response.data.talks)) {
        const filteredTalks = await filterBlockedTalks(response.data.talks, isAdmin);
        res.json({ ...response.data, talks: filteredTalks });
      } else {
        // If talks is not an array or doesn't exist, return the original response
        res.json(response.data);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Fetch Featured Talk
  app.get("/api/featured_talk", async (req, res) => {
    try {
      const response = await axios.get(`${FLASK_API}/featured_talk`);
      const isAdmin = isAdminRequest(req);
      
      // Check if the featured talk exists and has an ID
      if (response.data && response.data.talk && response.data.talk.talk__id && !isAdmin) {
        const talkId = response.data.talk.talk__id.toString();
        const talkRef = db.collection('blockedTalks').doc(talkId);
        const talkDoc = await talkRef.get();
        
        if (talkDoc.exists) {
          // Talk is blocked, try to get a fallback
          try {
            const fallbackResponse = await axios.get(`${FLASK_API}/editors_picks?top_k=1`);
            
            if (fallbackResponse.data && 
                fallbackResponse.data.talks && 
                Array.isArray(fallbackResponse.data.talks) && 
                fallbackResponse.data.talks.length > 0) {
              
              const fallbackTalk = fallbackResponse.data.talks[0];
              const fallbackId = fallbackTalk.talk__id ? fallbackTalk.talk__id.toString() : null;
              
              if (fallbackId) {
                const fallbackRef = db.collection('blockedTalks').doc(fallbackId);
                const fallbackDoc = await fallbackRef.get();
                
                if (!fallbackDoc.exists) {
                  return res.json({ talk: fallbackTalk });
                }
              } else {
                return res.json({ talk: fallbackTalk });
              }
            }
          } catch (fallbackError) {
            console.error("Error fetching fallback featured talk:", fallbackError);
          }
          
          return res.json({ talk: null, message: "Featured talk is unavailable" });
        }
      }
      
      // If talk not blocked or user is admin, return original response
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// // Fetch TED Talks by topic
// app.get("/api/talks_by_topic", async (req, res) => {
//     try {
//       const topic = req.query.topic || "all";  // Default to "all"
//       const response = await axios.get(`${FLASK_API}/talks_by_topic?topic=${topic}`);
//       res.json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
//   // Route to fetch Hidden Gems
//   app.get("/api/hidden_gems", async (req, res) => {
//     try {
//       const response = await axios.get(`${FLASK_API}/hidden_gems?top_k=4`);
//       res.json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
//   // Route to fetch a random TED Talk
//   app.get("/api/random_talk", async (req, res) => {
//     try {
//       const response = await axios.get(`${FLASK_API}/random_talk?count=5`);
//       res.json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
//   // Route to fetch Editor's Picks
//   app.get("/api/editors_picks", async (req, res) => {
//     try {
//       const response = await axios.get(`${FLASK_API}/editors_picks?top_k=9`);
//       res.json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
//   // Fetch Featured Talk
//   app.get("/api/featured_talk", async (req, res) => {
//     try {
//       const response = await axios.get(`${FLASK_API}/featured_talk`);
//       res.json(response.data);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });


// Search endpoint
// Search endpoint
app.get("/search", async (req, res) => {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
  
    try {
      const response = await axios.get(`${FLASK_API}/search`, { params: { query } });
      const isAdmin = isAdminRequest(req);
      
      // Only proceed with filtering if we have search results
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        // If user is not an admin, filter the results
        if (!isAdmin) {
          // Get the blocked talks from Firestore
          const blockedTalksSnapshot = await db.collection('blockedTalks').get();
          const blockedTalkIds = blockedTalksSnapshot.docs.map(doc => doc.id);
          
          // Filter out any talk that has an ID in the blocked list
          const filteredResults = response.data.results.filter(talk => {
            // Safe check for talk_id existence
            const talkId = talk.talk__id ? talk.talk__id.toString() : null;
            return talkId && !blockedTalkIds.includes(talkId) ? true : false;
          });
          
          // Return the filtered results
          return res.json({
            ...response.data,
            results: filteredResults,
            count: filteredResults.length
          });
        }
      }
      
      // For admin users or if there are no results to filter, return the original response
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching data from Flask backend:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

app.listen(8000, () => console.log("Server running on port 8000"));