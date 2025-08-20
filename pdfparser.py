import re
from typing import List, Tuple

def extract_courses_separate_lists(text: str) -> Tuple[List[str], List[str]]:
    """
    Extract course codes and numbers from transcript text.
    Returns (course_codes, course_numbers) as separate lists.
    """
    # Common course code patterns (e.g., CS, MATH, ENGL, etc.)
    course_pattern = r'\b([A-Z]{2,4})\s*(\d{3}[A-Z]?)\b'
    
    matches = re.findall(course_pattern, text.upper())
    
    course_codes = []
    course_numbers = []
    
    for code, number in matches:
        course_codes.append(code)
        course_numbers.append(number)
    
    # Remove duplicates while preserving order
    seen_courses = set()
    unique_codes = []
    unique_numbers = []
    
    for i, (code, number) in enumerate(zip(course_codes, course_numbers)):
        full_course = code + number
        if full_course not in seen_courses:
            seen_courses.add(full_course)
            unique_codes.append(code)
            unique_numbers.append(number)
    
    return unique_codes, unique_numbers

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
