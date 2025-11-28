# backend/utils.py
def grade_to_category(score: float) -> str:
    """Converts a continuous predicted score (0-20) into a performance category."""
    
    # Ensure score is within the 0-20 range for categorization
    score = max(0, min(20, score)) 
    
    if score < 10:
        return "Fail"
    elif score < 14:
        return "Pass"
    elif score < 17:
        return "Good"
    else:
        return "Excellent"