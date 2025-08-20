import json
from typing import List, Dict
import random
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class CourseRecommender:
    def __init__(self, embeddings_file: str = 'embedded_courses.json'):
        with open(embeddings_file, 'r') as f:
            self.course_data = json.load(f)
        
        self.embeddings = {}
        self.course_info = {}
        
        for course_code, data in self.course_data.items():
            # Store course info
            self.course_info[course_code] = {
                'url': data.get('url', ''),
                'useful_percentage': data.get('useful_percentage'),
                'easy_percentage': data.get('easy_percentage'), 
                'liked_percentage': data.get('liked_percentage'),
                'course_description': data.get('course_description', ''),
                'reviews': data.get('reviews', [])
            }
            
            # Store embeddings if available
            if 'embedding' in data and data['embedding']:
                self.embeddings[course_code] = np.array(data['embedding'])
    

    
    def recommend_courses_json(self, request_json: str) -> str:
        try:
            request = json.loads(request_json)
            completed_courses = request.get("completed_courses", [])
            
            valid_completed = []
            completed_embeddings = []
            
            # Find valid completed courses with embeddings
            for course in completed_courses:
                course_upper = course.upper()
                if course_upper in self.embeddings:
                    valid_completed.append(course_upper)
                    completed_embeddings.append(self.embeddings[course_upper])
            
            # If no valid courses with embeddings, fall back to smart filtering
            if not completed_embeddings:
                return self._fallback_recommendations(completed_courses)
            
            # Calculate user profile from completed courses
            profile_embedding = np.mean(completed_embeddings, axis=0).reshape(1, -1)
            
            # Get all course codes and embeddings
            all_codes = list(self.embeddings.keys())
            all_embs = np.stack([self.embeddings[c] for c in all_codes])
            
            # Calculate similarities
            similarities = cosine_similarity(profile_embedding, all_embs)[0]
            
            # Smart filtering and scoring
            candidates = []
            for i, course_code in enumerate(all_codes):
                if course_code in valid_completed:
                    continue  # Skip already completed courses
                    
                info = self.course_info[course_code]
                liked_pct = info.get('liked_percentage') or 0
                easy_pct = info.get('easy_percentage') or 50
                useful_pct = info.get('useful_percentage') or 50
                
                # Filter: Only recommend well-liked courses
                if liked_pct < 70:
                    continue
                    
                # Filter: Reasonable difficulty range
                if not (60 <= easy_pct <= 100):
                    continue
                
                # Combine similarity with course quality metrics
                similarity_score = similarities[i]
                quality_score = (liked_pct + useful_pct) / 200  # Normalize to 0-1
                
                # Weighted final score
                final_score = 0.7 * similarity_score + 0.3 * quality_score
                
                candidates.append((course_code, final_score, info))
            
            # Sort by score and get top 5
            candidates.sort(key=lambda x: x[1], reverse=True)
            top_5 = candidates[:5]
            
            # Format recommendations
            recommendations = []
            for course_code, score, course_info in top_5:
                recommendations.append({
                    "course_code": course_code,
                    "score": float(score),
                    "course_info": {
                        "url": course_info["url"],
                        "useful_percentage": course_info["useful_percentage"],
                        "easy_percentage": course_info["easy_percentage"],
                        "liked_percentage": course_info["liked_percentage"],
                        "course_description": course_info["course_description"],
                        "reviews": course_info["reviews"]
                    }
                })
            
            return json.dumps({"recommendations": recommendations})
            
        except Exception as e:
            return json.dumps({"recommendations": [], "error": str(e)})
    
    def _fallback_recommendations(self, completed_courses: list) -> str:
        """Fallback to quality-based recommendations when no embeddings available"""
        try:
            # Filter by course quality only
            quality_courses = []
            for course_code, info in self.course_info.items():
                liked_pct = info.get('liked_percentage') or 0
                useful_pct = info.get('useful_percentage') or 50
                
                if liked_pct >= 75 and useful_pct >= 70:  # High quality threshold
                    quality_score = (liked_pct + useful_pct) / 200
                    quality_courses.append((course_code, quality_score, info))
            
            # Sort by quality and get top 5
            quality_courses.sort(key=lambda x: x[1], reverse=True)
            top_5 = quality_courses[:5]
            
            recommendations = []
            for course_code, score, course_info in top_5:
                recommendations.append({
                    "course_code": course_code,
                    "score": float(score),
                    "course_info": {
                        "url": course_info["url"],
                        "useful_percentage": course_info["useful_percentage"],
                        "easy_percentage": course_info["easy_percentage"],
                        "liked_percentage": course_info["liked_percentage"],
                        "course_description": course_info["course_description"],
                        "reviews": course_info["reviews"]
                    }
                })
            
            return json.dumps({"recommendations": recommendations})
            
        except Exception as e:
            return json.dumps({"recommendations": [], "error": str(e)})