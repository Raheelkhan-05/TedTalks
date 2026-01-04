import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./Pages/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Pages/styles/AdminPanel.css"; // Import your CSS file
import deleteIcon from "./Pages/img/delete-48.png";

const AdminPanel = () => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [talks, setTalks] = useState([]);
  const [blockedTalks, setBlockedTalks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [passwordInputs, setPasswordInputs] = useState({});
  const [activeTab, setActiveTab] = useState("users");
  const [mergedTalks, setMergedTalks] = useState([]);
  const [talkFilterOption, setTalkFilterOption] = useState("all"); // "all", "available", "blocked"

  const BACKEND_API = process.env.REACT_APP_BACKEND_API || "http://localhost:8000";

  // Add these state variables at the top of your component with other state variables
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [talkSearchQuery, setTalkSearchQuery] = useState("");

  useEffect(() => {
    // Find any forms in the document
    const forms = document.querySelectorAll('form');
    
    // Add a listener to each form to log submission
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        console.log('Form submission detected');
        e.preventDefault(); // Prevent submission for debugging
      });
    });
    
    return () => {
      // Clean up listeners
      forms.forEach(form => {
        form.removeEventListener('submit', () => {});
      });
    };
  }, []);

  // Search handlers
  const handleUserSearch = (e) => {
    setUserSearchQuery(e.target.value);
  };

  const handleTalkSearch = (e) => {
    setTalkSearchQuery(e.target.value);
  };
  
  const navigate = useNavigate();

  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (loading) return; // Wait for auth to initialize
      
      if (!user) {
        navigate("/"); // Uncommented this to redirect when no user
        setIsLoading(false);
        return;
      }

      try {
        const userEmail = user.email.replace(/\./g, "_");
        const userDocRef = doc(db, "users", userEmail);
        const userDoc = await getDoc(userDocRef);
        console.log("User Document From AdminP:", userDoc.data());
        if (userDoc.exists() && userDoc.data().isAdmin) {
          setIsAdmin(true);
          fetchUsers();
          fetchTalks();
          fetchBlockedTalks();
          console.log("User is admin");
        } else {
          setIsAdmin(false);
          navigate("/"); // Redirect non-admin users
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, loading, navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      
      // Initialize password inputs for each user
      const inputs = {};
      usersList.forEach(user => {
        inputs[user.id] = "";
      });
      setPasswordInputs(inputs);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch all talks
  const fetchTalks = async () => {
    try {
      const response = await fetch(`${BACKEND_API}/api/all_talks`);
      const data = await response.json();
      setTalks(data.talks || []);
    } catch (error) {
      console.error("Error fetching talks:", error);
    }
  };

  // Fetch blocked talks
  const fetchBlockedTalks = async () => {
    try {
      const blockedTalksRef = collection(db, "blockedTalks");
      const blockedTalksSnapshot = await getDocs(blockedTalksRef);
      const blockedTalksList = blockedTalksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlockedTalks(blockedTalksList);
    } catch (error) {
      console.error("Error fetching blocked talks:", error);
    }
  };

  // Merge talks with blocked status information
useEffect(() => {
    if (talks.length > 0 || blockedTalks.length > 0) {
      // First, create a lookup map of all talks from the API
      const talksMap = new Map();
      talks.forEach(talk => {
        talksMap.set(talk.talk__id.toString(), talk);
      });
      
      // Create a merged list ensuring blocked talks are included
      let combined = [...talks];
      
      // Add blocked talks that aren't in the API response
      blockedTalks.forEach(blockedTalk => {
        const talkId = blockedTalk.id;
        if (!talksMap.has(talkId)) {
          // This is a blocked talk not in the API response - add it
          combined.push({
            talk__id: parseInt(talkId),
            talk__name: blockedTalk.talkName || `Talk ID: ${talkId}`,
            isBlocked: true,
            blockedAt: blockedTalk.blockedAt || null,
            blockedBy: blockedTalk.blockedBy || null
          });
        }
      });
      
      // Now mark all blocked talks in the combined list
      combined = combined.map(talk => {
        const blockedInfo = blockedTalks.find(bt => bt.id === talk.talk__id.toString());
        return {
          ...talk,
          isBlocked: !!blockedInfo,
          blockedAt: blockedInfo?.blockedAt || talk.blockedAt || null,
          blockedBy: blockedInfo?.blockedBy || talk.blockedBy || null
        };
      });
      
      setMergedTalks(combined);
    }
  }, [talks, blockedTalks]);
//   useEffect(() => {
//     if (talks.length > 0 && blockedTalks.length >= 0) {
//       const combined = talks.map(talk => {
//         const blockedInfo = blockedTalks.find(bt => bt.id === talk.talk__id.toString());
//         return {
//           ...talk,
//           isBlocked: !!blockedInfo,
//           blockedAt: blockedInfo?.blockedAt || null,
//           blockedBy: blockedInfo?.blockedBy || null
//         };
//       });
//       setMergedTalks(combined);
//     }
//   }, [talks, blockedTalks]);

  // View user history
  const viewUserHistory = async (userId) => {
    try {
      setSelectedUser(userId);
      // Switch to history tab
      setActiveTab("history");
      
      const historyRef = collection(db, `users/${userId}/history`);
      const historySnapshot = await getDocs(historyRef);
      
      const watchedTalks = historySnapshot.docs.map(doc => ({
        talkId: doc.id,
        ...doc.data()
      }));
      
      if (watchedTalks.length === 0) {
        setUserHistory([]);
        return;
      }
      
      const watchedTalkIds = watchedTalks.map(item => item.talkId);
      
      try {
        const response = await fetch(`${BACKEND_API}/api/all_talks`);
        const data = await response.json();
        const allTalks = data.talks || [];
        
        const userHistoryTalks = allTalks.filter(talk => 
          watchedTalkIds.includes(talk.talk__id.toString())
        ).map(talk => {
          // Find matching history item to get watch details
          const historyItem = watchedTalks.find(item => 
            item.talkId === talk.talk__id.toString()
          );

          console.log("History Item:", historyItem);
          
          return {
            ...talk,
            watchDate: historyItem?.lastUpdated || "Unknown",
            watchDuration: historyItem?.watchedDuration || 0,
          };
        });
        
        setUserHistory(userHistoryTalks);
      } catch (error) {
        console.error("Error fetching talk details:", error);
        setUserHistory([]);
      }
    } catch (error) {
      console.error("Error fetching user history:", error);
      setUserHistory([]);
    }
  };

  // Remove user account
  const removeUser = async (userId) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}?`)) {
      try {
        await deleteDoc(doc(db, "users", userId));
        alert(`User ${userId} has been deleted`);
        fetchUsers(); // Refresh user list
      } catch (error) {
        console.error("Error removing user:", error);
        alert("Failed to delete user");
      }
    }
  };

  // Update your updateUserPassword function in AdminPanel.js
  const updateUserPassword = async (userId, e) => {
    // Prevent the default form submission behavior which causes page reload
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (!passwordInputs[userId]) {
      alert("Please enter a new password");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First, get the user's email by replacing underscores with dots
      const userEmail = userId.replace(/_/g, ".");
      
      const response = await fetch(`${BACKEND_API}/api/update_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: user.email,  // Current admin's email
          adminUid: user.uid,      // Current admin's UID for verification
          userEmail: userEmail,    // Target user's email
          newPassword: passwordInputs[userId]
        })
      });
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update the Firestore document
      await updateDoc(doc(db, "users", userId), {
        password: passwordInputs[userId]
      });
      
      // Clear just this user's password input first, before showing alert
      setPasswordInputs(prev => ({
        ...prev,
        [userId]: ""
      }));
      
      // Show success message after state is updated
      alert(`Password updated for user ${userId}`);
      
    } catch (error) {
      console.error("Error updating password:", error);
      alert(`Failed to update password: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password input change
  const handlePasswordChange = (userId, value) => {
    setPasswordInputs(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  // Block/unblock TED talk
  const toggleBlockTalk = async (talkId, talkName) => {
    try {
      const talkRef = doc(db, "blockedTalks", talkId.toString());
      const talkDoc = await getDoc(talkRef);
      
      if (talkDoc.exists()) {
        // Unblock talk
        await deleteDoc(talkRef);
        alert(`Talk "${talkName}" has been unblocked`);
      } else {
        // Block talk
        await setDoc(talkRef, { 
          talkId: talkId.toString(),
          talkName,
          blockedAt: new Date(),
          blockedBy: user.email
        });
        alert(`Talk "${talkName}" has been blocked`);
      }
      
      fetchBlockedTalks(); // Refresh blocked talks list
    } catch (error) {
      console.error("Error toggling talk block status:", error);
      alert("Failed to update talk block status");
    }
  };

  // Check if user is a Google user (has no password)
  const isGoogleUser = (userEmail) => {
    // Simple check: find the user and see if they have a providerData indicating Google auth
    const userFound = users.find(u => u.id === userEmail);
    return userFound && userFound.isGoogleUser === true;
  };

  // Format timestamp to readable date
  const formatBlockedDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    try {
      // Handle Firestore Timestamp objects
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      // Handle Date objects or timestamp numbers
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid date";
    }
  };

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>Unauthorized. You need admin privileges to access this page.</div>;
  }

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.id.toLowerCase().includes(userSearchQuery.toLowerCase())
  );
  
  // Filter talks based on search query and filter option
  const filteredTalks = mergedTalks.filter(talk => {
    const matchesSearch = talk.talk__id.toString().includes(talkSearchQuery) || 
                          talk.talk__name.toLowerCase().includes(talkSearchQuery.toLowerCase());
                          
    if (talkFilterOption === "all") return matchesSearch;
    if (talkFilterOption === "blocked") return matchesSearch && talk.isBlocked;
    if (talkFilterOption === "available") return matchesSearch && !talk.isBlocked;
    
    return matchesSearch;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title"><span className="highlight">Admin</span> Panel</h1>
        <div className="title-underline"></div>
      </div>
      
      {/* Background shapes for design flair */}
      <div className="accent-shape shape1"></div>
      <div className="accent-shape shape2"></div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === "users" ? "active" : ""}`} 
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
        <button 
          className={`tab-button ${activeTab === "talks" ? "active" : ""}`} 
          onClick={() => setActiveTab("talks")}
        >
          Manage Talks
        </button>
        <button 
          className={`tab-button ${activeTab === "history" ? "active" : ""}`} 
          onClick={() => setActiveTab("history")}
        >
          View User History
        </button>
      </div>
      
      {activeTab === "users" && (
        <div className="admin-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by User ID..."
              value={userSearchQuery}
              onChange={handleUserSearch}
              className="admin-input search-input"
            />
          </div>
          <h2>User Management</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.isAdmin ? "Yes" : "No"}</td>
                  <td style={{display:'flex', alignItems:'center', gap:'10px', justifyContent:'center', flexDirection:'row', justifyItems:'center'}}>
                    <button style={{backgroundColor:"transparent"}} onClick={() => removeUser(user.id)}>
                      <img src={deleteIcon} width={"25px"} alt="Delete" className="delete-icon" />
                    </button>
                    {!isGoogleUser(user.id) && (
                        <div className="inline-form-group" style={{marginTop: '0px'}}>
                            <input
                            className="admin-input"
                            type="password"
                            placeholder="New Password"
                            value={passwordInputs[user.id] || ""}
                            onChange={(e) => handlePasswordChange(user.id, e.target.value)}
                            />
                            <button 
                            className="admin-btn admin-btn-primary" 
                            onClick={(e) => updateUserPassword(user.id, e)}
                            type="button" // Explicitly set as button type
                            >
                            Update Password
                            </button>
                        </div>
                        )}
                    <button className="admin-btn admin-btn-secondary" onClick={() => viewUserHistory(user.id)}>
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === "talks" && (
        <div className="admin-section">
          <div className="search-filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by Talk ID or Name..."
                value={talkSearchQuery}
                onChange={handleTalkSearch}
                className="admin-input search-input"
              />
            </div>
            <div className="filter-container">
              <select 
                className="admin-select" 
                value={talkFilterOption}
                onChange={(e) => setTalkFilterOption(e.target.value)}
              >
                <option value="all">All Talks</option>
                <option value="blocked">Blocked Only</option>
                <option value="available">Available Only</option>
              </select>
            </div>
          </div>
          
          <h2>TED Talks Management</h2>
          <p className="admin-info-text">
            Viewing {filteredTalks.length} talks ({blockedTalks.length} currently blocked)
          </p>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Talk ID</th>
                <th>Talk Name</th>
                <th>Status</th>
                <th>Blocked Date</th>
                <th>Blocked By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalks
                .sort((a, b) => a.talk__id - b.talk__id) // Sorting by ID in ascending order
                .map(talk => (
                  <tr 
                    key={talk.talk__id} 
                    className={talk.isBlocked ? "blocked-item" : ""}
                  >
                    <td>{talk.talk__id}</td>
                    <td>{talk.talk__name}</td>
                    <td>
                      <span className={`status-badge ${talk.isBlocked ? "status-blocked" : "status-available"}`}>
                        {talk.isBlocked ? "Blocked" : "Available"}
                      </span>
                    </td>
                    <td>{formatBlockedDate(talk.blockedAt)}</td>
                    <td>{talk.blockedBy || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => toggleBlockTalk(talk.talk__id, talk.talk__name)}
                        className={`admin-btn ${talk.isBlocked ? "admin-btn-success" : "admin-btn-danger"}`}
                      >
                        {talk.isBlocked ? "Unblock Talk" : "Block Talk"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === "history" && (
        <div className="admin-section">
          <h2>User History</h2>
          <select 
            className="admin-select" 
            onChange={(e) => viewUserHistory(e.target.value)} 
            value={selectedUser || ""}>
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.id}</option>
            ))}
          </select>
          
          {selectedUser && (
            <div className="user-history-container">
              <div className="user-history-header">
                <h3>History for {selectedUser}</h3>
              </div>
              
              {userHistory.length === 0 ? (
                <div className="no-history">
                  <p>No history found for this user</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Talk ID</th>
                      <th>Talk Name</th>
                      <th>Watch Date</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userHistory.map(talk => (
                      <tr key={talk.talk__id}>
                        <td>{talk.talk__id}</td>
                        <td>{talk.talk__name}</td>
                        <td>{talk.watchDate ? new Date(talk.watchDate.toDate ? talk.watchDate.toDate() : talk.watchDate).toLocaleString() : "Unknown"}</td>
                        <td>{talk.watchDuration}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;