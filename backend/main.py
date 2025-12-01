# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os
import sys

# Use relative imports for local files
from .schema import StudentInput
from .utils import grade_to_category
# from .database import log_prediction  <-- COMMENTED OUT TO PREVENT CRASHES

# Initialize FastAPI
app = FastAPI(title="Student Performance Prediction API")

# --- 1. Load Model and Preprocessing Components ---
# The path navigates to the 'model' folder INSIDE 'backend'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Assumes structure: backend/model/trained_student_linear_model.joblib
MODEL_PATH = os.path.join(BASE_DIR, "model", "trained_student_linear_model.joblib")

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from: {MODEL_PATH}")
except Exception as e:
    print(f"❌ ERROR: Could not load model. Check path: {e}")
    # We don't exit here so the app can at least start and show health check
    # sys.exit(1) 


# --- 2. Configure CORS ---
# In production, you should ideally change "*" to your Vercel URL
origins = ["*"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 3. Define Endpoints ---

@app.get("/", summary="Health Check")
def health_check():
    return {"status": "ok", "message": "Student Grade Prediction API is live!"}

@app.post("/predict", summary="Predict Student Performance")
def predict_grade(data: StudentInput):
    
    # CRITICAL: This list contains all 41 features in the EXACT order
    features = np.array([
        # --- Original/Scaled Features ---
        data.gender, data.age, data.home_location, data.family_size, 
        data.parent_status, data.mother_education, data.father_education, 
        data.travel_time, data.study_time, data.past_failures, 
        data.schoolsup, data.famsup, data.paid, data.activities, 
        data.nursery, data.higher, data.internet, data.romantic, 
        data.family_relationship, data.free_time, data.social_outing, 
        data.weekday_alcohol, data.weekend_alcohol, data.health_status, 
        data.absences, data.grade_period1, data.grade_period2, 
        
        # --- One-Hot Encoded Features ---
        data.school_name_MS, data.mother_job_health, data.mother_job_other, 
        data.mother_job_services, data.mother_job_teacher, data.father_job_health, 
        data.father_job_other, data.father_job_services, data.father_job_teacher, 
        data.school_reason_home, data.school_reason_other, 
        data.school_reason_reputation, data.primary_guardian_mother, 
        data.primary_guardian_other
    ]).reshape(1, -1) 

    # Predict
    predicted_score = model.predict(features)[0]
    
    # Ensure score is clipped and convert to category
    final_score = np.clip(predicted_score, 0, 20)
    category = grade_to_category(final_score)

    # Database logging is removed for stability
    
    return {
        "predicted_score": round(float(final_score), 2),
        "category": category,
        "detail": f"Predicted Grade: {round(float(final_score), 2)}/20"
    }
    
    # to run the frontend npm run dev in student performance prediction ml main integrated terminal(npm install)
    # to run backend in root folder student performance prediction  run py -m uvicorn backend.main:app --reload 