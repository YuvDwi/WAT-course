from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json
from typing import List, Dict
from sentence_transformers import SentenceTransformer

class CourseRecommender:
    def __init__(self, embeddings_file: str = 'embedded_courses.json'):
        with open(embeddings_file, 'r') as f:
            self.course_data = json.load(f)
        
        self.review_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        self.embeddings = {}
        self.course_info = {}
        self.review_embeddings = {}
        
        for course_code, data in self.course_data.items():
            if 'embedding' in data and data['embedding']:
                self.embeddings[course_code] = np.array(data['embedding'])
                self.course_info[course_code] = {
                    'url': data.get('url', ''),
                    'useful_percentage': data.get('useful_percentage'),
                    'easy_percentage': data.get('easy_percentage'), 
                    'liked_percentage': data.get('liked_percentage'),
                    'course_description': data.get('course_description', ''),
                    'reviews': data.get('reviews', [])
                }
                
                reviews = data.get('reviews', [])
                if reviews:
                    review_embedding = self.generate_review_embedding(reviews)
                    self.review_embeddings[course_code] = review_embedding
    
    def generate_review_embedding(self, reviews: List[str]) -> np.ndarray:
        if not reviews:
            return np.zeros(384)
        
        clean_reviews = []
        for review in reviews:
            if isinstance(review, str) and len(review.strip()) > 10:
                clean_reviews.append(review.strip())
        
        if not clean_reviews:
            return np.zeros(384)
        
        embeddings = self.review_model.encode(clean_reviews)
        return np.mean(embeddings, axis=0)
    
    def get_review_profile_embedding(self, completed_courses: List[str]) -> np.ndarray:
        review_embeddings = []
        for course in completed_courses:
            if course in self.review_embeddings:
                review_embeddings.append(self.review_embeddings[course])
        
        if review_embeddings:
            return np.mean(review_embeddings, axis=0)
        return np.zeros(384)
    
    def recommend_courses_json(self, request_json: str) -> str:
        try:
            request = json.loads(request_json)
            completed_courses = request.get("completed_courses", [])
            
            valid_completed = []
            completed_embeddings = []
            
            for course in completed_courses:
                course_upper = course.upper()
                if course_upper in self.embeddings:
                    valid_completed.append(course_upper)
                    completed_embeddings.append(self.embeddings[course_upper])
            
            if not valid_completed:
                return json.dumps({"recommendations": [], "error": "No valid completed courses found"})
            
            profile_embedding = np.mean(completed_embeddings, axis=0).reshape(1, -1)
            review_profile = self.get_review_profile_embedding(valid_completed).reshape(1, -1)
            
            all_codes = list(self.embeddings.keys())
            all_embs = np.stack([self.embeddings[c] for c in all_codes])
            
            content_similarities = cosine_similarity(profile_embedding, all_embs)[0]
            
            review_similarities = np.zeros(len(all_codes))
            if np.any(review_profile):
                all_review_embs = []
                review_indices = []
                for i, course_code in enumerate(all_codes):
                    if course_code in self.review_embeddings:
                        all_review_embs.append(self.review_embeddings[course_code])
                        review_indices.append(i)
                
                if all_review_embs:
                    all_review_embs = np.stack(all_review_embs)
                    review_sims = cosine_similarity(review_profile, all_review_embs)[0]
                    for j, idx in enumerate(review_indices):
                        review_similarities[idx] = review_sims[j]
            
            candidates = []
            weights = {
                'content_similarity': 0.25,
                'review_similarity': 0.25,
                'liked': 0.15,
                'useful': 0.1,
                'easy': 0.25
            }
            
            for i, course_code in enumerate(all_codes):
                if course_code in valid_completed:
                    continue
                    
                info = self.course_info[course_code]
                liked_pct = info.get('liked_percentage') or 0
                easy_pct = info.get('easy_percentage') or 50
                useful_pct = info.get('useful_percentage') or 50
                
                if liked_pct < 70:
                    continue
                    
                if not (60 <= easy_pct <= 100):
                    continue
                
                content_score = content_similarities[i]
                review_score = review_similarities[i]
                
                liked_norm = liked_pct / 100.0
                useful_norm = useful_pct / 100.0
                easy_norm = easy_pct / 100.0
                
                composite_score = (weights['content_similarity'] * content_score + 
                                 weights['review_similarity'] * review_score +
                                 weights['liked'] * liked_norm + 
                                 weights['useful'] * useful_norm +
                                 weights['easy'] * easy_norm)
                
                candidates.append((course_code, composite_score, info))
            
            candidates.sort(key=lambda x: x[1], reverse=True)
            top_5 = candidates[:5]
            
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