import re
from typing import List, Tuple

def extract_courses_separate_lists(text: str) -> Tuple[List[str], List[str]]:
    """
    Extract course codes and numbers from transcript text.
    Uses the proven method that looks for "Course" sections.
    Returns (course_codes, course_numbers) as separate lists.
    """
    print(f"🔍 Looking for Course sections in transcript...")
    
    course_codes = []
    course_numbers = []

    # Find all "Course" sections - this is the key pattern from your working script
    course_sections = re.findall(r'Course\s*(.*?)(?=Description|Term GPA|Grade|$)', text, re.DOTALL)
    
    print(f"📚 Found {len(course_sections)} Course sections")

    for i, section in enumerate(course_sections):
        print(f"🔍 Processing section {i+1}: {section[:50]}...")
        
        lines = [line.strip() for line in section.split('\n') if line.strip()]

        for line in lines:
            # Check if it's a department code (2-5 uppercase letters only)
            if re.match(r'^[A-Z]{2,5}$', line):
                course_codes.append(line)
                print(f"  📖 Found course code: {line}")
            # Check if it's a course number (digits + optional letters only)
            elif re.match(r'^\d+[A-Z]*$', line):
                course_numbers.append(line)
                print(f"  🔢 Found course number: {line}")

    print(f"✅ Total course codes found: {len(course_codes)}")
    print(f"✅ Total course numbers found: {len(course_numbers)}")
    
    # Create full course list for verification
    if course_codes and course_numbers:
        min_length = min(len(course_codes), len(course_numbers))
        sample_courses = [course_codes[i] + course_numbers[i] for i in range(min(5, min_length))]
        print(f"📚 Sample full courses: {sample_courses}")

    return course_codes, course_numbers

def extract_courses_full_codes(text: str) -> List[str]:
    """
    Extract complete course codes (e.g., CS240, MATH135) from transcript text.
    """
    codes, numbers = extract_courses_separate_lists(text)
    return [codes[i] + numbers[i] for i in range(len(codes))]

def extract_grades(text: str) -> List[Tuple[str, str]]:
    """
    Extract courses and their grades from transcript text.
    Returns list of (course_code, grade) tuples.
    """
    # Pattern to match course and grade (e.g., "CS240 85" or "MATH135 A+")
    grade_pattern = r'\b([A-Z]{2,4}\s*\d{3}[A-Z]?)\s+([A-F][+-]?|\d{1,3})\b'
    
    matches = re.findall(grade_pattern, text.upper())
    
    course_grades = []
    for course, grade in matches:
        course_clean = re.sub(r'\s+', '', course)  # Remove spaces
        course_grades.append((course_clean, grade))
    
    return course_grades
