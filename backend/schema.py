# backend/schema.py
from pydantic import BaseModel

# This list must contain ALL 41 features in the EXACT ORDER of your trained model.
class StudentInput(BaseModel):
    # --- Original Numerical/Scaled Features (27 Features) ---
    gender: float
    age: float
    home_location: float
    family_size: float
    parent_status: float
    mother_education: float
    father_education: float
    travel_time: float
    study_time: float
    past_failures: float
    schoolsup: float
    famsup: float
    paid: float
    activities: float
    nursery: float
    higher: float
    internet: float
    romantic: float
    family_relationship: float
    free_time: float
    social_outing: float
    weekday_alcohol: float
    weekend_alcohol: float
    health_status: float
    absences: float
    grade_period1: float
    grade_period2: float
    
    # --- One-Hot Encoded (OHE) Features (14 Features) ---
    school_name_MS: int
    mother_job_health: int
    mother_job_other: int
    mother_job_services: int
    mother_job_teacher: int
    father_job_health: int
    father_job_other: int
    father_job_services: int
    father_job_teacher: int
    school_reason_home: int
    school_reason_other: int
    school_reason_reputation: int
    primary_guardian_mother: int
    primary_guardian_other: int
    