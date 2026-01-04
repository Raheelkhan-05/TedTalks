from datetime import datetime
import re
from flask import Flask, jsonify, request
import pandas as pd
import ast
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from symspellpy import SymSpell, Verbosity
from flask_cors import CORS
from sklearn.preprocessing import normalize
import io
import os
from rapidfuzz import process, fuzz

app = Flask(__name__)

# Load dataset
df = pd.read_csv("TED_Talk_Processed.csv")

CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

# Convert 'talks__tags' column to a list of tags
df["talks__tags"] = df["talks__tags"].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else [])

# Ensure 'view_count' is numeric
df["view_count"] = pd.to_numeric(df["view_count"], errors="coerce").fillna(0).astype(int)

# Ensure 'comment_count' is numeric (if exists)
if "comment_count" in df.columns:
    df["comment_count"] = pd.to_numeric(df["comment_count"], errors="coerce").fillna(0).astype(int)
    
# Convert `recording_date` column to datetime & handle errors
df["recording_date"] = pd.to_datetime(df["recording_date"], errors="coerce")  # Converts invalid dates to NaT


# Extract 'high' quality video link from dictionary
def extract_video_url(video_column):
    try:
        video_dict = ast.literal_eval(video_column) if isinstance(video_column, str) else {}
        return video_dict.get("high", "")
    except (ValueError, SyntaxError):
        return ""

df["url__video"] = df["url__video"].apply(extract_video_url)

# Extract all unique topics
all_tags = [tag for tags_list in df["talks__tags"] for tag in tags_list]
unique_topics = list(set(all_tags))  # All available topics
top_7_topics = pd.Series(all_tags).value_counts().head(10).index.tolist()  # Most frequent 7 topics

embeddings = np.load("./ted_talk_embeddings.npy")  

# Create a mapping from talk_id to its index in embeddings
talk_id_to_index = {talk_id: idx for idx, talk_id in enumerate(df["talk__id"].values)}


def get_recommendations(talk_id, top_k=5):
    """Finds top_k most similar talks based on cosine similarity"""
    if talk_id not in talk_id_to_index:
        raise ValueError(f"Talk ID {talk_id} not found in mapping.")
    
    query_index = talk_id_to_index[talk_id]  # Convert talk_id to index

    similarities = cosine_similarity([embeddings[query_index]], embeddings)[0]
    return np.argsort(-similarities)[1:top_k+1]  # Exclude self

required_columns = [
    "talk__name", "speaker__name", "view_count", "duration", "talks__tags",
    "talk__description", "url__video", "url__photo__talk", "talk__id", "recording_date"
]

def get_recommended_talks(watched_ids, top_k=10):
    """Returns a list of recommended TED Talks based on watched talks"""
    recommended_talks = []
    
    for talk_id in watched_ids:
        try:
            talk_id = int(talk_id)  # Ensure it's an integer
            recs = get_recommendations(talk_id, top_k=3)  
            recommended_talks.extend(recs)
        except ValueError:
            print(f"⚠️ Skipping invalid talk ID: {talk_id}")

    # Remove duplicates using talk__name
    unique_recs = []
    seen_talk_names = set()

    for rec_index in recommended_talks:
        if rec_index < 0 or rec_index >= len(df):  # Ensure valid index
            continue
        talk_name = df.iloc[rec_index]['talk__name']
        if talk_name not in seen_talk_names:
            seen_talk_names.add(talk_name)
            unique_recs.append(rec_index)

    # Select only the required columns
    recommendations = df.iloc[unique_recs][required_columns].to_dict(orient="records")
    return recommendations



@app.route('/recommendations', methods=['POST'])
def recommend_talks():
    """API endpoint to get recommended talks based on watched history"""
    try:
        data = request.get_json()
        watched_ids = data.get("watched_talks", [])

        if not watched_ids:
            return jsonify({"error": "No watched talks provided"}), 400

        # Convert all IDs to integers
        watched_ids = [int(talk_id) for talk_id in watched_ids]

        recommended_talks = get_recommended_talks(watched_ids, top_k=5)

        return jsonify({"talks": recommended_talks})

    except ValueError:
        return jsonify({"error": "Invalid talk ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# # Initialize SymSpell for TED Talk titles
# sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
# dictionary_path = "ted_talks_dictionary.txt"

# with io.open(dictionary_path, mode="r", encoding="utf-8") as f:
#     sym_spell._load_dictionary_stream(f, term_index=0, count_index=1)

# # Initialize SymSpell for speaker names
# sym_spell_speakers = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
# speaker_dictionary_path = "ted_talks_speakers_dictionary.txt"

# with io.open(speaker_dictionary_path, mode="r", encoding="utf-8") as f:
#     sym_spell_speakers._load_dictionary_stream(f, term_index=0, count_index=1)
    
# # Spell correction function for TED Talk titles
# def correct_multi_word_spelling(query):
#     suggestion = sym_spell.lookup_compound(query, max_edit_distance=2)
#     return suggestion[0].term if suggestion else query

# # Spell correction function for speaker names
# def correct_speaker_name(query):
#     formatted_query = query.lower().replace(" ", "_")
#     suggestions = sym_spell_speakers.lookup(formatted_query, verbosity=2, max_edit_distance=2)
#     corrected_name = suggestions[0].term if suggestions else formatted_query
#     return corrected_name.replace("_", " ")


# # Search TED Talks based on corrected query
# @app.route("/search", methods=["GET"])
# def search_ted_talks():
#     query = request.args.get("query", "").strip().lower()

#     if not query:
#         return jsonify({"error": "Query cannot be empty"}), 400

#     corrected_title = correct_multi_word_spelling(query)
#     corrected_speaker = correct_speaker_name(query)

#     matched_talks = df[df['talk__name'].str.contains(corrected_title, case=False, na=False)]
#     matched_speakers = df[df['speaker__name'].str.contains(corrected_speaker, case=False, na=False)]

#     all_matches = pd.concat([matched_talks, matched_speakers], ignore_index=True)
    
#     # Drop duplicates using hashable columns
#     hashable_cols = [
#         "talk__name", "speaker__name", "view_count", "duration",
#         "talk__description", "url__video", "url__photo__talk",
#         "talk__id", "recording_date"
#     ]
#     all_matches = all_matches.drop_duplicates(subset=hashable_cols)

#     if all_matches.empty:
#         return jsonify({"message": "No matching TED Talks found."})

#     results = all_matches[[
#         "talk__name", "speaker__name", "view_count", "duration",
#         "talks__tags", "talk__description", "url__video", "url__photo__talk",
#         "talk__id", "recording_date"
#     ]].to_dict(orient="records")

#     return jsonify({
#         "query": query,
#         "corrected_title": corrected_title,
#         "corrected_speaker": corrected_speaker,
#         "results": results
#     })

# # Initialize SymSpell for TED Talk titles
# sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
# dictionary_path = "ted_talks_dictionary.txt"

# with io.open(dictionary_path, mode="r", encoding="utf-8") as f:
#     sym_spell._load_dictionary_stream(f, term_index=0, count_index=1)

# # Initialize SymSpell for speaker names
# sym_spell_speakers = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
# speaker_dictionary_path = "ted_talks_speakers_dictionary.txt"

# with io.open(speaker_dictionary_path, mode="r", encoding="utf-8") as f:
#     sym_spell_speakers._load_dictionary_stream(f, term_index=0, count_index=1)

# # Initialize SymSpell for individual words
# sym_spell_words = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
# words_dictionary_path = "ted_talks_words_dictionary.txt"

# with io.open(words_dictionary_path, mode="r", encoding="utf-8") as f:
#     sym_spell_words._load_dictionary_stream(f, term_index=0, count_index=1)

# # Create a list of all speaker names for partial matching
# def load_speaker_list():
#     speaker_list = []
#     try:
#         with io.open(speaker_dictionary_path, mode="r", encoding="utf-8") as f:
#             for line in f:
#                 parts = line.strip().split(" ")
#                 if len(parts) >= 1:
#                     speaker_name = parts[0].replace("_", " ")
#                     speaker_list.append(speaker_name)
#     except Exception as e:
#         print(f"Error loading speaker list: {e}")
#     return speaker_list

# speaker_list = load_speaker_list()

# # Spell correction function for TED Talk titles
# def correct_multi_word_spelling(query):
#     # Try compound lookup first
#     compound_suggestion = sym_spell.lookup_compound(query, max_edit_distance=2)
#     if compound_suggestion:
#         return compound_suggestion[0].term
    
#     # If that fails, try correcting individual words
#     words = query.split()
#     corrected_words = []
    
#     for word in words:
#         word_suggestions = sym_spell_words.lookup(word, Verbosity.CLOSEST, max_edit_distance=2)
#         if word_suggestions:
#             corrected_words.append(word_suggestions[0].term)
#         else:
#             corrected_words.append(word)
    
#     return " ".join(corrected_words)

# # Spell correction function for speaker names
# def correct_speaker_name(query):
#     # First try full name correction
#     formatted_query = query.lower().replace(" ", "_")
#     full_suggestions = sym_spell_speakers.lookup(formatted_query, Verbosity.ALL, max_edit_distance=2)
    
#     if full_suggestions:
#         return full_suggestions[0].term.replace("_", " ")
    
#     # If that fails, look for partial matches (first name or last name)
#     words = query.split()
#     for word in words:
#         word = word.lower()
#         # Check if this word is part of any speaker name
#         for speaker in speaker_list:
#             speaker_lower = speaker.lower()
#             if word in speaker_lower:
#                 return speaker
    
#     # If no match, try word correction
#     corrected_words = []
#     for word in words:
#         word_suggestions = sym_spell_words.lookup(word, Verbosity.CLOSEST, max_edit_distance=2)
#         if word_suggestions:
#             corrected_words.append(word_suggestions[0].term)
#         else:
#             corrected_words.append(word)
    
#     return " ".join(corrected_words)

# # Search TED Talks based on corrected query
# @app.route("/search", methods=["GET"])
# def search_ted_talks():
#     query = request.args.get("query", "").strip().lower()

#     if not query:
#         return jsonify({"error": "Query cannot be empty"}), 400

#     # Correct the query for title matching
#     corrected_title = correct_multi_word_spelling(query)
    
#     # Correct the query for speaker matching
#     corrected_speaker = correct_speaker_name(query)
    
#     # Initialize empty DataFrames for different match types
#     matched_talks = pd.DataFrame()
#     matched_speakers = pd.DataFrame()
#     matched_tags = pd.DataFrame()
#     matched_partial_title = pd.DataFrame()
    
#     # Exact title match (case insensitive)
#     exact_title_matches = df[df['talk__name'].str.lower() == corrected_title.lower()]
    
#     # Partial title match using contains
#     if exact_title_matches.empty:
#         # Try partial matching (contains)
#         matched_talks = df[df['talk__name'].str.contains(corrected_title, case=False, na=False)]
        
#         # If still empty, try matching individual words from the query
#         if matched_talks.empty:
#             words = corrected_title.split()
#             for word in words:
#                 if len(word) > 3:  # Only match on meaningful words (avoid "the", "and", etc.)
#                     partial_matches = df[df['talk__name'].str.contains(word, case=False, na=False)]
#                     matched_partial_title = pd.concat([matched_partial_title, partial_matches])
#     else:
#         matched_talks = exact_title_matches

#     # Speaker matching
#     matched_speakers = df[df['speaker__name'].str.contains(corrected_speaker, case=False, na=False)]
    
#     # Tag matching - convert string representation of list to actual list and check if query is in any tag
#     if 'talks__tags' in df.columns:
#         for idx, row in df.iterrows():
#             tags = row['talks__tags']
#             # Check if tags is a string representation of a list
#             if isinstance(tags, str):
#                 try:
#                     # Try to evaluate the string as a list
#                     import ast
#                     tag_list = ast.literal_eval(tags)
#                     if any(query.lower() in tag.lower() for tag in tag_list):
#                         matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])
#                 except:
#                     # If the string can't be evaluated, try direct string contains
#                     if query.lower() in tags.lower():
#                         matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])
#             # If tags is already a list
#             elif isinstance(tags, list):
#                 if any(query.lower() in tag.lower() for tag in tags):
#                     matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])

#     # Combine all matches and remove duplicates
#     all_matches = pd.concat([matched_talks, matched_speakers, matched_tags, matched_partial_title], ignore_index=True)
    
#     # Drop duplicates using hashable columns
#     hashable_cols = [
#         "talk__name", "speaker__name", "view_count", "duration",
#         "talk__description", "url__video", "url__photo__talk",
#         "talk__id", "recording_date"
#     ]
#     all_matches = all_matches.drop_duplicates(subset=list(set(hashable_cols) & set(all_matches.columns)))

#     if all_matches.empty:
#         return jsonify({
#             "message": "No matching TED Talks found.",
#             "query": query,
#             "corrected_title": corrected_title,
#             "corrected_speaker": corrected_speaker
#         })

#     # Select columns that exist in the DataFrame
#     available_cols = [col for col in [
#         "talk__name", "speaker__name", "view_count", "duration",
#         "talks__tags", "talk__description", "url__video", "url__photo__talk",
#         "talk__id", "recording_date"
#     ] if col in all_matches.columns]
    
#     results = all_matches[available_cols].to_dict(orient="records")

#     return jsonify({
#         "query": query,
#         "corrected_title": corrected_title,
#         "corrected_speaker": corrected_speaker,
#         "results": results
#     })


# Initialize SymSpell for TED Talk titles
sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
dictionary_path = "ted_talks_dictionary.txt"

with io.open(dictionary_path, mode="r", encoding="utf-8") as f:
    sym_spell._load_dictionary_stream(f, term_index=0, count_index=1)

# Initialize SymSpell for speaker names
sym_spell_speakers = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
speaker_dictionary_path = "ted_talks_speakers_dictionary.txt"

with io.open(speaker_dictionary_path, mode="r", encoding="utf-8") as f:
    sym_spell_speakers._load_dictionary_stream(f, term_index=0, count_index=1)

# Initialize SymSpell for individual words
sym_spell_words = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
words_dictionary_path = "ted_talks_words_dictionary.txt"

with io.open(words_dictionary_path, mode="r", encoding="utf-8") as f:
    sym_spell_words._load_dictionary_stream(f, term_index=0, count_index=1)

# Create a list of all speaker names for partial matching
def load_speaker_list():
    speaker_list = []
    try:
        with io.open(speaker_dictionary_path, mode="r", encoding="utf-8") as f:
            for line in f:
                parts = line.strip().split(" ")
                if len(parts) >= 1:
                    speaker_name = parts[0].replace("_", " ")
                    speaker_list.append(speaker_name)
    except Exception as e:
        print(f"Error loading speaker list: {e}")
    return speaker_list

speaker_list = load_speaker_list()

# Spell correction function for TED Talk titles
def correct_multi_word_spelling(query):
    # Try compound lookup first for exact phrase correction
    compound_suggestion = sym_spell.lookup_compound(query, max_edit_distance=2)
    if compound_suggestion:
        return compound_suggestion[0].term, True  # Second param indicates valid correction
    
    # If that fails, try correcting individual words
    words = query.split()
    corrected_words = []
    
    for word in words:
        word_suggestions = sym_spell_words.lookup(word, Verbosity.CLOSEST, max_edit_distance=2)
        if word_suggestions:
            corrected_words.append(word_suggestions[0].term)
        else:
            corrected_words.append(word)
    
    return " ".join(corrected_words), False  # Not a verified correction

# Spell correction function for speaker names
def correct_speaker_name(query):
    # First try full name correction
    formatted_query = query.lower().replace(" ", "_")
    full_suggestions = sym_spell_speakers.lookup(formatted_query, Verbosity.ALL, max_edit_distance=2)
    
    if full_suggestions:
        return full_suggestions[0].term.replace("_", " ")
    
    # If that fails, look for partial matches (first name or last name)
    words = query.split()
    for word in words:
        word = word.lower()
        # Check if this word is part of any speaker name
        for speaker in speaker_list:
            speaker_lower = speaker.lower()
            if word in speaker_lower:
                return speaker
    
    # If no match, try word correction
    corrected_words = []
    for word in words:
        word_suggestions = sym_spell_words.lookup(word, Verbosity.CLOSEST, max_edit_distance=2)
        if word_suggestions:
            corrected_words.append(word_suggestions[0].term)
        else:
            corrected_words.append(word)
    
    return " ".join(corrected_words)

# Function to load tag dictionary
def load_tag_dictionary():
    tag_list = []
    try:
        # If you have a tag dictionary file, use this
        # tag_dictionary_path = "ted_talks_tags_dictionary.txt"
        # with io.open(tag_dictionary_path, mode="r", encoding="utf-8") as f:
        #     for line in f:
        #         parts = line.strip().split(" ")
        #         if len(parts) >= 1:
        #             tag = parts[0]
        #             tag_list.append(tag)
        
        # If no tag dictionary file, extract from dataframe
        if 'talks__tags' in df.columns:
            all_tags = set()
            for idx, row in df.iterrows():
                tags = row['talks__tags']
                if isinstance(tags, list):
                    all_tags.update(tags)
                elif isinstance(tags, str):
                    try:
                        import ast
                        tag_list = ast.literal_eval(tags)
                        all_tags.update(tag_list)
                    except:
                        pass
            tag_list = list(all_tags)
    except Exception as e:
        print(f"Error loading tag list: {e}")
    return tag_list

# Identify if query is a tag
def is_tag_query(query, tag_list):
    query = query.lower()
    for tag in tag_list:
        if tag.lower() == query:
            return True, tag
    
    # Try fuzzy matching for tags
    for tag in tag_list:
        if query in tag.lower() or tag.lower() in query:
            return True, tag
    
    return False, None

# Search TED Talks based on corrected query
# Fix for the search function to properly handle multi-word queries
@app.route("/search", methods=["GET"])
def search_ted_talks():
    query = request.args.get("query", "").strip().lower()

    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    # Initialize tag list
    tag_list = load_tag_dictionary()
    
    # Store original query for later use
    original_query = query
    
    # Check if the query might be a tag
    is_tag, matched_tag = is_tag_query(query, tag_list)
    
    # For tag queries, we'll use the exact tag
    if is_tag:
        corrected_query = matched_tag
        corrected_title = matched_tag
        corrected_speaker = matched_tag
    else:
        # Correct the query for title matching
        corrected_title, is_valid_correction = correct_multi_word_spelling(query)
        
        # Don't use "my my my" type corrections - stick with original query if correction isn't valid
        if not is_valid_correction and "my my" in corrected_title:
            corrected_title = query
        
        # Correct the query for speaker matching
        corrected_speaker = correct_speaker_name(query)
        
        # Use original query if corrected looks suspicious
        if "my my" in corrected_speaker:
            corrected_speaker = query
    
    # Initialize empty DataFrames for different match types
    matched_talks = pd.DataFrame()
    matched_speakers = pd.DataFrame()
    matched_tags = pd.DataFrame()
    matched_partial_title = pd.DataFrame()
    exact_original_matches = pd.DataFrame()
    exact_corrected_matches = pd.DataFrame()
    
    # Try exact match with the ORIGINAL query first (highest priority)
    exact_original_matches = df[df['talk__name'].str.lower() == original_query.lower()]
    
    # Then try exact match with the corrected title
    if corrected_title.lower() != original_query.lower():
        exact_corrected_matches = df[df['talk__name'].str.lower() == corrected_title.lower()]
    
    # If exact matches exist, use them
    if not exact_original_matches.empty:
        matched_talks = exact_original_matches
    elif not exact_corrected_matches.empty:
        matched_talks = exact_corrected_matches
    else:
        # Try partial matching with BOTH original and corrected query
        matched_talks_original = df[df['talk__name'].str.contains(original_query, case=False, na=False)]
        matched_talks_corrected = df[df['talk__name'].str.contains(corrected_title, case=False, na=False)]
        matched_talks = pd.concat([matched_talks_original, matched_talks_corrected])
        
        # If still empty, try matching individual words from the query
        if matched_talks.empty:
            # Try with original query words
            words = original_query.split()
            for word in words:
                if len(word) > 3:  # Only match on meaningful words (avoid "the", "and", etc.)
                    partial_matches = df[df['talk__name'].str.contains(word, case=False, na=False)]
                    matched_partial_title = pd.concat([matched_partial_title, partial_matches])
            
            # Also try with corrected query words if different
            if corrected_title.lower() != original_query.lower():
                words = corrected_title.split()
                for word in words:
                    if len(word) > 3:
                        partial_matches = df[df['talk__name'].str.contains(word, case=False, na=False)]
                        matched_partial_title = pd.concat([matched_partial_title, partial_matches])

    # Speaker matching
    matched_speakers = df[df['speaker__name'].str.contains(corrected_speaker, case=False, na=False)]
    
    # Tag matching (code remains the same as original)
    if is_tag:
        # Direct tag matching for identified tags
        for idx, row in df.iterrows():
            tags = row['talks__tags'] if 'talks__tags' in df.columns else None
            if tags is not None:
                # Handle list or string representation
                if isinstance(tags, list):
                    if any(matched_tag.lower() == tag.lower() for tag in tags):
                        matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])
                elif isinstance(tags, str):
                    try:
                        import ast
                        tag_list = ast.literal_eval(tags)
                        if any(matched_tag.lower() == tag.lower() for tag in tag_list):
                            matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])
                    except:
                        if matched_tag.lower() in tags.lower():
                            matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])
    else:
        # Regular tag search
        if 'talks__tags' in df.columns:
            for idx, row in df.iterrows():
                tags = row['talks__tags']
                # Check if tags is a string representation of a list
                if isinstance(tags, str):
                    try:
                        import ast
                        tag_list = ast.literal_eval(tags)
                        if any(query.lower() in tag.lower() for tag in tag_list):
                            matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])
                    except:
                        if query.lower() in tags.lower():
                            matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])
                # If tags is already a list
                elif isinstance(tags, list):
                    if any(query.lower() in tag.lower() for tag in tags):
                        matched_tags = pd.concat([matched_tags, pd.DataFrame([row])])

    # Add a relevance score column to prioritize exact matches
    # First combine all matches
    all_matches = pd.concat([matched_talks, matched_speakers, matched_tags, matched_partial_title], ignore_index=True)
    
    if not all_matches.empty:
        # Add a relevance score column
        all_matches['relevance_score'] = 0
        
        # Prioritize exact title matches
        # if 'talk__name' in all_matches.columns:
        if 'talk__name' in all_matches.columns or 'speaker__name' in all_matches.columns:
            for idx, row in all_matches.iterrows():
                talk_name = row['talk__name'].lower() if not pd.isna(row['talk__name']) else ""
                speaker_name = row['speaker__name'].lower() if not pd.isna(row['speaker__name']) else ""

                # Highest priority: Exact match with original query (case insensitive)
                if talk_name == original_query.lower():
                    all_matches.at[idx, 'relevance_score'] += 150
                
                # Second priority: Exact match with corrected query
                elif talk_name == corrected_title.lower():
                    all_matches.at[idx, 'relevance_score'] += 100
                
                # Third priority: Contains original query as substring
                elif original_query.lower() in talk_name:
                    all_matches.at[idx, 'relevance_score'] += 85
                
                # Fourth priority: Contains corrected query as substring
                elif corrected_title.lower() in talk_name:
                    all_matches.at[idx, 'relevance_score'] += 75
                
                # Contains all words from original query but not in sequence
                elif all(word in talk_name for word in original_query.lower().split()):
                    all_matches.at[idx, 'relevance_score'] += 65
                
                # Contains all words from corrected query but not in sequence
                elif all(word in talk_name for word in corrected_title.lower().split()):
                    all_matches.at[idx, 'relevance_score'] += 50
                
                # Contains some words from original query
                else:
                    orig_words = original_query.lower().split()
                    matching_orig_words = sum(1 for word in orig_words if word in talk_name and len(word) > 3)
                    all_matches.at[idx, 'relevance_score'] += matching_orig_words * 15
                    
                    # If we have a corrected query that's different, also score on that
                    if corrected_title.lower() != original_query.lower():
                        corr_words = corrected_title.lower().split()
                        matching_corr_words = sum(1 for word in corr_words if word in talk_name and len(word) > 3)
                        all_matches.at[idx, 'relevance_score'] += matching_corr_words * 10
        
                # ==== Speaker relevance scoring ====
                if speaker_name == original_query.lower():
                    all_matches.at[idx, 'relevance_score'] += 140  # Almost as high as title exact match
                elif speaker_name == corrected_speaker.lower():
                    all_matches.at[idx, 'relevance_score'] += 90
                elif original_query.lower() in speaker_name:
                    all_matches.at[idx, 'relevance_score'] += 70
                elif corrected_speaker.lower() in speaker_name:
                    all_matches.at[idx, 'relevance_score'] += 60
                elif all(word in speaker_name for word in original_query.lower().split()):
                    all_matches.at[idx, 'relevance_score'] += 50
                elif all(word in speaker_name for word in corrected_speaker.lower().split()):
                    all_matches.at[idx, 'relevance_score'] += 40
                else:
                    orig_words = original_query.lower().split()
                    matching_orig_words = sum(1 for word in orig_words if word in speaker_name and len(word) > 3)
                    all_matches.at[idx, 'relevance_score'] += matching_orig_words * 12

                    if corrected_speaker.lower() != original_query.lower():
                        corr_words = corrected_speaker.lower().split()
                        matching_corr_words = sum(1 for word in corr_words if word in speaker_name and len(word) > 3)
                        all_matches.at[idx, 'relevance_score'] += matching_corr_words * 8

        
        # Sort by relevance score (highest first)
        all_matches = all_matches.sort_values(by='relevance_score', ascending=False).reset_index(drop=True)

        # If speaker name matches exactly with original or corrected query, filter only their talks
        if speaker_name == original_query.lower():
            all_matches = all_matches[all_matches['speaker__name'].str.lower() == speaker_name].reset_index(drop=True)
        elif speaker_name == corrected_speaker.lower():
            all_matches = all_matches[all_matches['speaker__name'].str.lower() == speaker_name].reset_index(drop=True)

    
    # Drop duplicates using hashable columns
    hashable_cols = [
        "talk__name", "speaker__name", "view_count", "duration",
        "talk__description", "url__video", "url__photo__talk",
        "talk__id", "recording_date"
    ]
    all_matches = all_matches.drop_duplicates(subset=list(set(hashable_cols) & set(all_matches.columns)))

    if all_matches.empty:
        return jsonify({
            "message": "No matching TED Talks found.",
            "query": original_query,
            "corrected_query": corrected_title if corrected_title != original_query else original_query
        })

    # Select columns that exist in the DataFrame
    available_cols = [col for col in [
        "talk__name", "speaker__name", "view_count", "duration",
        "talks__tags", "talk__description", "url__video", "url__photo__talk",
        "talk__id", "recording_date", "relevance_score"
    ] if col in all_matches.columns]
    
    results = all_matches[available_cols].to_dict(orient="records")

    # Display original query if it matched, otherwise show corrected query
    display_corrected_query = original_query
    if not exact_original_matches.empty:
        display_corrected_query = original_query
    elif not exact_corrected_matches.empty:
        display_corrected_query = corrected_title
    elif "my my" in corrected_title:
        display_corrected_query = original_query
    else:
        display_corrected_query = corrected_title

    # Count how many results found
    result_count = len(results)

    return jsonify({
        "query": original_query,
        "corrected_query": display_corrected_query if display_corrected_query != original_query else original_query,
        "count": result_count,
        "results": results
    })



@app.route('/speakers', methods=['GET'])
def get_all_speakers():
    required_columns = [
        "speaker__name", "speaker__description", "speaker__who_he_is", "url__photo__speaker"
    ]
    
    # Drop duplicates to get unique speakers
    unique_speakers = df[required_columns].drop_duplicates()
    
      # Ensure the 'url__photo__speaker' column remains as a string (avoids conversion issues)
    unique_speakers["url__photo__speaker"] = unique_speakers["url__photo__speaker"].astype(str)

    # Convert DataFrame to JSON serializable format
    speakers_list = unique_speakers.to_dict(orient="records")

    return jsonify({"speakers": speakers_list})


@app.route('/all_talks', methods=['GET'])

def get_all_talks():
    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration", "talks__tags",
        "talk__description", "url__video", "url__photo__talk", "talk__id", "recording_date"
    ]

    # Replace NaT with an empty string or a default value (e.g., "Unknown Date")
    df["recording_date"] = df["recording_date"].fillna("Unknown Date").astype(str)

    all_talks = df[required_columns].to_dict(orient="records")
    
    return jsonify({"talks": all_talks})

@app.route('/trending', methods=['GET'])
def get_trending_talks():
    trending_talks = df.sort_values(by="view_count", ascending=False).head(10)
    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration", "talks__tags",
        "talk__description", "url__video", "url__photo__talk","talk__id","recording_date"
    ]
    return jsonify({"talks": trending_talks[required_columns].to_dict(orient="records")})

@app.route('/trendinghome', methods=['GET'])
def get_trending_talkshome():
    trending_talks = df.sort_values(by="view_count", ascending=False).head(4)
    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration", "talks__tags",
        "talk__description", "url__video", "url__photo__talk","talk__id","recording_date"
    ]
    return jsonify({"talks": trending_talks[required_columns].to_dict(orient="records")})

@app.route('/api/talk/<int:talk_id>', methods=['GET'])
def get_talk_by_id(talk_id):
    talk = df[df["talk__id"] == talk_id]

    if talk.empty:
        return jsonify({"error": "Talk not found"}), 404

    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration", "talks__tags",
        "talk__description", "url__video", "url__photo__talk", "talk__id", "recording_date"
    ]

    return jsonify({"talk": talk[required_columns].to_dict(orient="records")[0]})


@app.route('/top_topics', methods=['GET'])
def get_top_topics():
    return jsonify({"top_topics": top_7_topics})

@app.route('/talks_by_topic', methods=['GET'])
def get_talks_by_topic():
    topic = request.args.get("topic", "").lower()
    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration",
        "talks__tags", "talk__description", "url__video", "url__photo__talk","talk__id","recording_date"
    ]

    if topic == "all":
        filtered_talks = df[required_columns].sample(100)  # 🔹 Return random 10 talks
    else:
        filtered_talks = df[df["talks__tags"].apply(
            lambda tags: isinstance(tags, list) and topic in [t.lower() for t in tags]
        )][required_columns].sample(frac=1)  # 🔹 Shuffle results randomly

    return jsonify(filtered_talks.head(100).to_dict(orient="records"))

@app.route('/hidden_gems', methods=['GET'])
def get_hidden_gems():
    top_k = int(request.args.get("top_k", 4))

    if "comment_count" not in df.columns:
        return jsonify({"error": "comment_count column is missing"}), 400

    median_views = df["view_count"].median()
    df["engagement_score"] = df["comment_count"] / df["view_count"]
    hidden_gems = df[(df["view_count"] < median_views) & 
                     (df["engagement_score"] > df["engagement_score"].median())]

    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration",
        "talks__tags", "talk__description", "url__video", "url__photo__talk","talk__id","recording_date"
    ]

    return jsonify(hidden_gems.sample(min(top_k, len(hidden_gems)))[required_columns].to_dict(orient="records"))

@app.route('/random_talk', methods=['GET'])
def get_random_talk():
    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration",
        "talks__tags", "talk__description", "url__video", "url__photo__talk","talk__id","recording_date"
    ]

    random_talk = df[required_columns].sample(1).to_dict(orient="records")[0]
    return jsonify(random_talk)

@app.route('/editors_picks', methods=['GET'])
def get_editors_pick():
    top_k = int(request.args.get("top_k", 10))

    if "is_talk_featured" not in df.columns:
        return jsonify({"error": "is_talk_featured column is missing"}), 400

    editors_picks = df[df["is_talk_featured"] == 1]

    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration",
        "talks__tags", "talk__description", "url__video", "url__photo__talk","talk__id","recording_date"
    ]

    return jsonify(editors_picks.sample(min(top_k, len(editors_picks)))[required_columns].to_dict(orient="records"))

@app.route('/featured_talk', methods=['GET'])
def get_featured_talk():
    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration",
        "talks__tags", "talk__description", "url__video", "url__photo__talk","talk__id","recording_date","event"
    ]
    
    featured_talk = df[df["is_talk_featured"] == 1][required_columns].sample(1).to_dict(orient="records")[0]
    return jsonify(featured_talk)


# 🔹 **Load and Process Events Data**
events_df = df
events_df["recording_date"] = pd.to_datetime(events_df["recording_date"], errors="coerce", dayfirst=True)  # Convert DD-MM-YYYY to datetime
print(events_df["recording_date"].head())  # Check the conversion
print(f"Today's date: {datetime.today()}")
@app.route('/events', methods=['GET'])
def get_events():
    event_type = request.args.get("type", "upcoming")  # 'upcoming', 'past', or 'all'
    page = int(request.args.get("page", 1))
    page_size = 6
    today = datetime.today()
    # Clean out invalid dates before filtering  
    events_dfc = events_df.dropna(subset=["recording_date"])
    # Determine filtering logic
    if event_type == "upcoming":
        filtered_events = events_dfc[events_dfc["recording_date"] >= today].sort_values(by="recording_date", ascending=True)
    elif event_type == "past":
        filtered_events = events_dfc[events_dfc["recording_date"] < today].sort_values(by="recording_date", ascending=False)
    else:  # Show all talks (upcoming + past)
        filtered_events = events_dfc.sort_values(by="recording_date", ascending=False)

    # Select only required columns
    required_columns = [
        "talk__name", "speaker__name", "view_count", "duration",
        "talks__tags", "talk__description", "url__video", "url__photo__talk", "recording_date", "talk__id", "event"
    ]
    filtered_events = filtered_events[required_columns]

    # Check for full fetch or pagination
    all_events = request.args.get("all", "false").lower() == "true"

    if all_events:
        paginated_events = filtered_events.to_dict(orient="records")
        has_more = False  # When loading all, there's no "more"
    else:
        start = (page - 1) * page_size
        end = start + page_size
        paginated_events = filtered_events.iloc[start:end].to_dict(orient="records")
        has_more = len(filtered_events) > end

    return jsonify({
        "events": paginated_events,
        "has_more": has_more
    })


if __name__ == '__main__':
    app.run(debug=True)
