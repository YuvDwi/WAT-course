import json
from typing import List, Dict
import random
import numpy as np

class CourseRecommender:
    def __init__(self, embeddings_file: str = 'embedded_courses.json'):
        with open(embeddings_file, 'r') as f:
            self.course_data = json.load(f)
        
        self.course_info = {}
        
        for course_code, data in self.course_data.items():
            self.course_info[course_code] = {
                'url': data.get('url', ''),
                'useful_percentage': data.get('useful_percentage'),
                'easy_percentage': data.get('easy_percentage'), 
                'liked_percentage': data.get('liked_percentage'),
                'course_description': data.get('course_description', ''),
                'reviews': data.get('reviews', [])
            }
    

    
    def recommend_courses_json(self, request_json: str) -> str:
        try:
            request = json.loads(request_json)
            completed_courses = request.get("completed_courses", [])
            
            # Simple recommendation without ML - just return some courses
            available_courses = list(self.course_info.keys())
            random.shuffle(available_courses)
            
            recommendations = []
            for course_code in available_courses[:5]:  # Get 5 random courses
                info = self.course_info[course_code]
                recommendations.append({
                    "course_code": course_code,
                    "score": random.uniform(0.7, 0.9),  # Random score
                    "course_info": {
                        "url": info["url"],
                        "useful_percentage": info["useful_percentage"],
                        "easy_percentage": info["easy_percentage"],
                        "liked_percentage": info["liked_percentage"],
                        "course_description": info["course_description"],
                        "reviews": info["reviews"]
                    }
                })
            
            return json.dumps({"recommendations": recommendations})
            
        except Exception as e:
            return json.dumps({"recommendations": [], "error": str(e)})