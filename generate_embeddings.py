#!/usr/bin/env python3
"""
Local script to generate embeddings for all courses.
Run this on your local machine with sentence-transformers installed.
"""

import json
import numpy as np
from sentence_transformers import SentenceTransformer
import os

def generate_course_embeddings():
    print("🤖 Loading SentenceTransformer model locally...")
    
    # Load the best model locally (we have time and resources!)
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Model loaded successfully!")
    
    # Load existing course data
    embeddings_file = 'embedded_courses.json'
    if os.path.exists(embeddings_file):
        print(f"📂 Loading existing course data from {embeddings_file}")
        with open(embeddings_file, 'r') as f:
            course_data = json.load(f)
    else:
        print("⚠️ No existing course data found, creating sample data...")
        # Create sample course data for demonstration
        course_data = {
            "CS240": {
                "url": "https://example.com/cs240",
                "useful_percentage": 85,
                "easy_percentage": 60,
                "liked_percentage": 80,
                "course_description": "Data Structures and Data Management. Introduction to widely used and effective methods of data organization, focusing on data structures, their algorithms, and the performance of these algorithms.",
                "reviews": ["Great course for learning algorithms", "Challenging but rewarding"]
            },
            "MATH135": {
                "url": "https://example.com/math135", 
                "useful_percentage": 90,
                "easy_percentage": 70,
                "liked_percentage": 75,
                "course_description": "Algebra for Honours Mathematics. Systems of linear equations, matrix algebra, elementary matrices, computational issues. Real and complex numbers, polynomials, factorization.",
                "reviews": ["Solid foundation course", "Well structured"]
            },
            "CS246": {
                "url": "https://example.com/cs246",
                "useful_percentage": 88,
                "easy_percentage": 55,
                "liked_percentage": 85,
                "course_description": "Object-Oriented Software Development. Introduction to object-oriented programming and software engineering. Classes, inheritance, encapsulation, polymorphism, templates.",
                "reviews": ["Essential for software development", "Great practical knowledge"]
            }
        }
    
    # Generate embeddings for all courses
    print(f"🔧 Generating embeddings for {len(course_data)} courses...")
    
    embedded_courses = {}
    for course_code, data in course_data.items():
        print(f"  📚 Processing {course_code}...")
        
        # Copy all existing data
        embedded_courses[course_code] = data.copy()
        
        # Generate embedding from course description
        if 'course_description' in data and data['course_description']:
            description = data['course_description']
            print(f"    🧠 Generating embedding for: {description[:50]}...")
            
            # Generate embedding using the model
            embedding = model.encode(description)
            
            # Convert to list for JSON serialization
            embedded_courses[course_code]['embedding'] = embedding.tolist()
            
            print(f"    ✅ Generated {len(embedding)}-dimensional embedding")
        else:
            print(f"    ⚠️ No description found for {course_code}")
    
    # Save the embedded courses
    output_file = 'embedded_courses.json'
    print(f"💾 Saving embedded courses to {output_file}")
    
    with open(output_file, 'w') as f:
        json.dump(embedded_courses, f, indent=2)
    
    print(f"🎉 Successfully generated embeddings for {len(embedded_courses)} courses!")
    print(f"📊 Embedding dimension: {len(embedded_courses[list(embedded_courses.keys())[0]]['embedding'])}")
    print(f"📁 File size: {os.path.getsize(output_file) / 1024:.1f} KB")
    
    return embedded_courses

if __name__ == "__main__":
    generate_course_embeddings()
