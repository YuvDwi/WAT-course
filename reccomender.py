import json
from typing import List, Dict
import random
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class CourseRecommender:
    def __init__(self, embeddings_file: str = 'embedded_courses.json'):
        print(f"📂 Loading pre-computed embeddings from {embeddings_file}")
        with open(embeddings_file, 'r') as f:
            self.course_data = json.load(f)
        
        print(f"✅ Loaded {len(self.course_data)} courses with pre-computed embeddings!")
        
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
            
            # Load pre-computed embeddings (lightning fast!)
            if 'embedding' in data and data['embedding']:
                self.embeddings[course_code] = np.array(data['embedding'])
                print(f"⚡ Loaded {len(data['embedding'])}-dim embedding for {course_code}")
    
    def get_embedding_info(self) -> dict:
        """Get information about loaded embeddings"""
        if self.embeddings:
            sample_embedding = next(iter(self.embeddings.values()))
            return {
                "total_courses": len(self.embeddings),
                "embedding_dimension": len(sample_embedding),
                "courses_with_embeddings": list(self.embeddings.keys())[:5]  # Show first 5
            }
        return {"total_courses": 0, "embedding_dimension": 0}
    
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
                print("⚠️ No embeddings found for completed courses, using fallback recommendations")
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
            print(f"🔍 Analyzing {len(all_codes)} courses with pre-computed embeddings...")
            print(f"🧠 User profile embedding shape: {profile_embedding.shape}")
            print(f"📊 Course embeddings matrix shape: {all_embs.shape}")
            
            for i, course_code in enumerate(all_codes):
                if course_code in valid_completed:
                    continue  # Skip already completed courses
                    
                info = self.course_info[course_code]
                liked_pct = info.get('liked_percentage') or 0
                easy_pct = info.get('easy_percentage') or 50
                useful_pct = info.get('useful_percentage') or 50
                
                # More relaxed filtering for better recommendations
                if liked_pct < 50:  # At least 50% liked (was 70%)
                    continue
                    
                # No difficulty filtering - let users choose their own challenge level
                
                # Combine similarity with course quality metrics (HEAVY easiness emphasis!)
                similarity_score = similarities[i]
                
                # Quality score: 40% liked + 30% easiness + 30% usefulness (balanced)
                quality_score = (0.4 * liked_pct + 0.3 * easy_pct + 0.3 * useful_pct) / 100
                
                # Department bias: reduce emphasis on STEM courses
                dept = course_code[:2] if len(course_code) >= 2 else course_code
                stem_departments = {'CS', 'CE', 'EC', 'ME', 'CH', 'BM', 'NE', 'SY', 'CO', 'AM', 'MA', 'ST', 'PH', 'BI', 'SC', 'EA', 'MS', 'MT', 'CV', 'AF', 'AC'}
                
                # Apply department bias: favor STEM but allow non-STEM variety
                if dept in stem_departments:
                    dept_bias = 1.2  # Boost STEM course scores by 20%
                    print(f"    📈 STEM boost applied to {course_code}: {final_score:.3f} → {final_score * dept_bias:.3f}")
                else:
                    dept_bias = 0.9  # Slight reduction for non-STEM but still competitive
                    print(f"    📊 Non-STEM (competitive) applied to {course_code}: {final_score:.3f} → {final_score * dept_bias:.3f}")
                
                # Weighted final score with department bias
                final_score = 0.7 * similarity_score + 0.3 * quality_score
                biased_score = final_score * dept_bias
                
                candidates.append((course_code, biased_score, info))
            
            print(f"✅ Found {len(candidates)} valid candidates after filtering")
            
            # Sort by score
            candidates.sort(key=lambda x: x[1], reverse=True)
            
            # Add diversity: prefer different departments
            diverse_recommendations = []
            used_departments = set()
            
            print(f"🌈 Applying diversity filtering...")
            
            # First pass: prefer non-STEM departments for diversity
            stem_departments = {'CS', 'CE', 'EC', 'ME', 'CH', 'BM', 'NE', 'SY', 'CO', 'AM', 'MA', 'ST', 'PH', 'BI', 'SC', 'EA', 'MS', 'MT', 'CV', 'AF', 'AC'}
            
            # Balanced diversity: STEM-focused but with variety
            for course_code, score, info in candidates:
                dept = course_code[:2] if len(course_code) >= 2 else course_code
                if dept not in used_departments and len(diverse_recommendations) < 5:
                    diverse_recommendations.append((course_code, score, info))
                    used_departments.add(dept)
                    stem_label = "[STEM]" if dept in stem_departments else "[NON-STEM]"
                    print(f"  ✅ Added {course_code} (dept: {dept}) {stem_label}")
            
            # Second pass: fill remaining slots if we don't have 5
            for course_code, score, info in candidates:
                if len(diverse_recommendations) >= 5:
                    break
                # Add if not already in recommendations
                if not any(rec[0] == course_code for rec in diverse_recommendations):
                    diverse_recommendations.append((course_code, score, info))
                    print(f"  ➕ Added {course_code} (additional)")
            
            top_5 = diverse_recommendations[:5]
            
            print(f"🎯 Returning {len(top_5)} diverse recommendations")
            
            # Show department spread
            dept_spread = {}
            for course_code, _, _ in top_5:
                dept = course_code[:2] if len(course_code) >= 2 else course_code
                dept_spread[dept] = dept_spread.get(dept, 0) + 1
            print(f"📊 Department spread: {dept_spread}")
            
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
                easy_pct = info.get('easy_percentage') or 50
                
                if liked_pct >= 50 and easy_pct >= 60:  # Reasonable quality threshold
                    # Quality score: 40% liked + 30% easiness + 30% usefulness (balanced)
                    quality_score = (0.4 * liked_pct + 0.3 * easy_pct + 0.3 * useful_pct) / 100
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