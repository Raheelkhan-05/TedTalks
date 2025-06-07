import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
import re

app = Flask(__name__)

# Load TED Talk Data
df = pd.read_csv("ted_talks_data.csv")  # Ensure this file contains necessary columns
talk_embeddings = np.load("./ted_talk_embeddings.npy")  # Ensure correct path

# Required fields for response
required_columns = [
    "talk__name", "speaker__name", "view_count", "duration", "talks__tags",
    "talk__description", "url__video", "url__photo__talk", "talk__id", "recording_date"
]

# 🔹 **Fix 1: Preprocess Text Better**
def preprocess_text(text):
    """Clean and preprocess text for embeddings."""
    text = text.lower()
    text = re.sub(r"\W+", " ", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    return text

# Include more diverse text for embeddings
df["processed_text"] = (
    df["talk__name"] + " " +
    df["talk__description"] + " " +
    df["talks__tags"] + " " +
    df["speaker__name"] + " " + 
    df.get("transcript", "").fillna("")  # Add transcript if available
)
df["processed_text"] = df["processed_text"].apply(preprocess_text)

# 🔹 **Fix 2: Normalize Embeddings Before Computing Similarity**
normalized_embeddings = normalize(talk_embeddings)  # Normalize embeddings
similarity_matrix = cosine_similarity(normalized_embeddings)  # Compute similarity

# 🔹 **Fix 3: Improved Recommendation Function**
def get_recommendations(talk_id, top_k=3):
    """Get top_k most similar TED Talks based on cosine similarity."""
    if talk_id >= len(df):
        return []
    
    talk_similarities = similarity_matrix[talk_id]

    # Add small noise to prevent identical ranking (diversification)
    talk_similarities += np.random.uniform(0, 0.05, len(talk_similarities))

    top_indices = np.argsort(talk_similarities)[::-1][1 : top_k + 1]  # Exclude self
    return top_indices.tolist()

# 🔹 **Fix 4: Filter Out Overly Popular Talks**
def get_recommended_talks(watched_ids, top_k=3):
    """Generate personalized TED Talk recommendations."""
    recommended_talks = set()

    for talk_id in watched_ids:
        recs = get_recommendations(talk_id, top_k=5)  # Get extra recommendations
        recommended_talks.update(recs)

    recommendations = df.iloc[list(recommended_talks)][required_columns].to_dict(orient="records")

    # Remove overly popular TED Talks (view_count > 90th percentile)
    max_views = df["view_count"].quantile(0.90)
    recommendations = [talk for talk in recommendations if talk["view_count"] < max_views]

    # If still empty, return trending talks
    if not recommendations:
        recommendations = df.sort_values(by="view_count", ascending=False).head(top_k)[required_columns].to_dict(orient="records")

    return recommendations[:top_k]

@app.route("/recommendations", methods=["POST"])
def recommend():
    """API endpoint to fetch personalized TED Talk recommendations."""
    data = request.get_json()
    watched_ids = data.get("watched_ids", [])

    print("Received watched IDs:", watched_ids)  # Debugging

    # Validate watched_ids
    watched_ids = [int(i) for i in watched_ids if 0 <= i < len(df)]
    print("Processed watched IDs:", watched_ids)  # Debugging

    recommended_talks = get_recommended_talks(watched_ids)
    
    print("Recommended Talks:", recommended_talks)  # Debugging

    return jsonify({"talks": recommended_talks})

if __name__ == "__main__":
    app.run(debug=True)
