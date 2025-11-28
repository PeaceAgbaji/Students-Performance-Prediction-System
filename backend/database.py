# backend/database.py
import psycopg2
from typing import Optional, Dict

# --- IMPORTANT: FILL IN YOUR CREDENTIALS ---
DB_HOST = "localhost"
DB_NAME = "student_performance_db"
DB_USER = "postgres"  # Common default user
DB_PASS = "YOUR_PASSWORD" # <--- REPLACE THIS
# ---------------------------------------------

def connect_db() -> Optional[psycopg2.extensions.connection]:
    """Establishes a connection to the PostgreSQL database."""
    try:
        # Note: psycopg2-binary must be installed
        conn = psycopg2.connect(
            host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS
        )
        return conn
    except psycopg2.Error:
        return None

def log_prediction(data: Dict, prediction_score: float, category: str):
    """Inserts the prediction result into the predictions table."""
    conn = connect_db()
    if conn is None:
        return

    # Using a subset of features for logging (you can expand this later)
    query = """
    INSERT INTO predictions (
        grade_period1, grade_period2, study_time, absences, 
        prediction_score, category
    ) VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    values = (
        data.get('grade_period1', 0), 
        data.get('grade_period2', 0), 
        data.get('study_time', 0),    
        data.get('absences', 0),     
        prediction_score,
        category
    )

    try:
        with conn.cursor() as cur:
            cur.execute(query, values)
        conn.commit()
    except Exception as e:
        print(f"❌ DATABASE INSERTION ERROR: {e}")
    finally:
        conn.close()

def create_table_if_not_exists():
    """Creates the predictions table if it doesn't exist."""
    conn = connect_db()
    if conn is None:
        return
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS predictions (
                    id SERIAL PRIMARY KEY,
                    grade_period1 REAL,
                    grade_period2 REAL,
                    study_time REAL,
                    absences REAL,
                    prediction_score REAL,
                    category VARCHAR(50),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
        conn.commit()
    except Exception as e:
        print(f"❌ TABLE CREATION ERROR: {e}")
    finally:
        conn.close()

# Run the table creation function on startup
create_table_if_not_exists()