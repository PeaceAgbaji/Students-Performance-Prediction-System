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
from .database import log_prediction # This is the PostgreSQL function

# Initialize FastAPI
app = FastAPI(title="Student Performance Prediction API")

# --- 1. Load Model and Preprocessing Components ---
# The path must navigate UP one level (..) to find the 'model' folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "trained_student_linear_model.joblib")

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from: {MODEL_PATH}")
except Exception as e:
    print(f"❌ ERROR: Could not load model. Ensure model is in the '../model/' folder: {e}")
    sys.exit(1)


# --- 2. Configure CORS ---
origins = ["*"] # Allows your frontend to connect
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

    # --- LOG THE PREDICTION TO POSTGRESQL (Optional) ---
    # Prepare data for logging
    try:
        log_data = data.model_dump()
        log_prediction(
            data=log_data,
            prediction_score=float(final_score),
            category=category
        )
    except Exception as e:
         print(f"Warning: Logging failed. Error: {e}")
    # ----------------------------------------------------

    return {
        "predicted_score": round(float(final_score), 2),
        "category": category,
        "detail": f"Predicted Grade: {round(float(final_score), 2)}/20"
    }
    
    
    
    # to run the frontend npm run dev in student performance prediction ml main integrated terminal(npm install)
    # to run backend in root folder student performance prediction  run py -m uvicorn backend.main:app --reload     