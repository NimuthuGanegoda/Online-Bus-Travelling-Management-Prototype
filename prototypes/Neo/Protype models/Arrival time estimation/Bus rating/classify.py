import sys
import os
import joblib
import numpy as np

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'driver_rating_model.pkl')

# Load your model
model = joblib.load(model_path)

def predict():
    # Read all comments passed from Node.js
    input_data = sys.stdin.read()
    if not input_data.strip():
        return

    # Split by newline in case multiple comments are sent
    comments = [c.strip() for c in input_data.split('\n') if c.strip()]
    
    # Logic from your provided snippet
    raw_scores = model.predict(comments)
    clipped = np.clip(raw_scores, 1, 10)
    
    # Print each individual rating formatted to 1 decimal place
    for score in clipped:
        print(f"{round(float(score), 1)}")

if __name__ == "__main__":
    predict()