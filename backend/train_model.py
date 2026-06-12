import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    # Features: Age, BMI, Blood Pressure (Systolic), Glucose
    age = np.random.randint(18, 90, size=n_samples)
    bmi = np.random.uniform(18.5, 40.0, size=n_samples)
    bp = np.random.randint(90, 180, size=n_samples)
    glucose = np.random.randint(70, 200, size=n_samples)
    
    X = np.column_stack((age, bmi, bp, glucose))
    
    # Target rules (simplified logic to generate labels)
    y = []
    for row in X:
        a, b, p, g = row
        score = 0
        if a > 50: score += 1
        if b > 30: score += 1
        if p > 130: score += 1
        if g > 140: score += 1
        
        if score <= 1:
            y.append("Low Risk")
        elif score <= 2:
            y.append("Medium Risk")
        else:
            y.append("High Risk")
            
    return X, np.array(y)

if __name__ == "__main__":
    print("Generating synthetic dataset...")
    X, y = generate_synthetic_data()
    
    print("Splitting dataset into train/test...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy on Test Set: {acc:.2f}")
    
    # Save the model
    save_path = os.path.join(os.path.dirname(__file__), "api", "disease_risk_model.joblib")
    joblib.dump(clf, save_path)
    print(f"Model saved successfully to {save_path}")
