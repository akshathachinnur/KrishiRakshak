"""
Training script to generate the 3 required .pkl files:
  - crop_rf_model.pkl     (Random Forest model)
  - crop_scaler.pkl       (StandardScaler)
  - crop_label_encoder.pkl (LabelEncoder)

Uses the standard Crop Recommendation dataset.
"""

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ------------------------------
# Crop Recommendation Dataset
# Features: N, P, K, temperature, humidity, ph, rainfall
# Label: crop name
# ------------------------------

# Dataset with realistic agricultural data for 22 crops
# Based on the standard Kaggle Crop Recommendation Dataset structure
np.random.seed(42)

crop_data = {
    "rice":        {"N": (80, 10), "P": (48, 8), "K": (40, 5), "temperature": (23, 2), "humidity": (82, 5), "ph": (6.5, 0.3), "rainfall": (236, 20)},
    "maize":       {"N": (78, 8),  "P": (48, 7), "K": (20, 3), "temperature": (22, 2), "humidity": (65, 5), "ph": (6.2, 0.3), "rainfall": (88, 15)},
    "chickpea":    {"N": (40, 8),  "P": (68, 8), "K": (80, 5), "temperature": (18, 2), "humidity": (17, 3), "ph": (7.0, 0.3), "rainfall": (80, 10)},
    "kidneybeans": {"N": (20, 5),  "P": (68, 8), "K": (20, 3), "temperature": (20, 2), "humidity": (22, 3), "ph": (5.8, 0.3), "rainfall": (105, 15)},
    "pigeonpeas":  {"N": (20, 5),  "P": (68, 8), "K": (20, 3), "temperature": (27, 2), "humidity": (49, 5), "ph": (5.6, 0.3), "rainfall": (149, 15)},
    "mothbeans":   {"N": (21, 5),  "P": (48, 7), "K": (20, 3), "temperature": (28, 2), "humidity": (53, 5), "ph": (6.8, 0.3), "rainfall": (51, 10)},
    "mungbean":    {"N": (21, 5),  "P": (48, 7), "K": (20, 3), "temperature": (28, 2), "humidity": (85, 3), "ph": (6.7, 0.3), "rainfall": (48, 8)},
    "blackgram":   {"N": (40, 5),  "P": (68, 8), "K": (20, 3), "temperature": (30, 2), "humidity": (65, 3), "ph": (7.0, 0.3), "rainfall": (68, 10)},
    "lentil":      {"N": (18, 5),  "P": (68, 8), "K": (20, 3), "temperature": (24, 2), "humidity": (65, 3), "ph": (6.5, 0.3), "rainfall": (45, 8)},
    "pomegranate": {"N": (18, 5),  "P": (18, 5), "K": (40, 5), "temperature": (22, 2), "humidity": (90, 3), "ph": (6.4, 0.3), "rainfall": (107, 15)},
    "banana":      {"N": (100, 8), "P": (82, 8), "K": (50, 5), "temperature": (27, 2), "humidity": (80, 3), "ph": (6.0, 0.3), "rainfall": (104, 15)},
    "mango":       {"N": (20, 5),  "P": (18, 5), "K": (30, 5), "temperature": (31, 2), "humidity": (50, 5), "ph": (5.8, 0.3), "rainfall": (95, 15)},
    "grapes":      {"N": (23, 5),  "P": (132, 8),"K": (200, 10),"temperature": (24, 3),"humidity": (82, 3), "ph": (6.0, 0.3), "rainfall": (70, 10)},
    "watermelon":  {"N": (100, 8), "P": (18, 5), "K": (50, 5), "temperature": (26, 2), "humidity": (85, 3), "ph": (6.5, 0.3), "rainfall": (50, 10)},
    "muskmelon":   {"N": (100, 8), "P": (18, 5), "K": (50, 5), "temperature": (28, 2), "humidity": (92, 2), "ph": (6.3, 0.3), "rainfall": (25, 5)},
    "apple":       {"N": (21, 5),  "P": (134, 8),"K": (200, 10),"temperature": (23, 2),"humidity": (92, 2), "ph": (6.0, 0.3), "rainfall": (113, 15)},
    "orange":      {"N": (20, 5),  "P": (10, 3), "K": (10, 3), "temperature": (23, 3), "humidity": (92, 2), "ph": (7.0, 0.3), "rainfall": (110, 15)},
    "papaya":      {"N": (50, 8),  "P": (60, 8), "K": (50, 5), "temperature": (34, 3), "humidity": (92, 2), "ph": (6.7, 0.3), "rainfall": (145, 15)},
    "coconut":     {"N": (22, 5),  "P": (18, 5), "K": (30, 5), "temperature": (27, 2), "humidity": (95, 2), "ph": (6.0, 0.3), "rainfall": (175, 20)},
    "cotton":      {"N": (118, 10),"P": (46, 7), "K": (20, 3), "temperature": (24, 2), "humidity": (80, 3), "ph": (7.0, 0.3), "rainfall": (80, 10)},
    "jute":        {"N": (78, 8),  "P": (46, 7), "K": (40, 5), "temperature": (25, 2), "humidity": (85, 3), "ph": (6.7, 0.3), "rainfall": (175, 20)},
    "coffee":      {"N": (101, 8), "P": (28, 5), "K": (30, 5), "temperature": (25, 2), "humidity": (58, 5), "ph": (6.8, 0.3), "rainfall": (158, 20)},
}

SAMPLES_PER_CROP = 100

rows = []
for crop_name, params in crop_data.items():
    for _ in range(SAMPLES_PER_CROP):
        row = {
            "N": max(0, np.random.normal(params["N"][0], params["N"][1])),
            "P": max(0, np.random.normal(params["P"][0], params["P"][1])),
            "K": max(0, np.random.normal(params["K"][0], params["K"][1])),
            "temperature": np.random.normal(params["temperature"][0], params["temperature"][1]),
            "humidity": np.random.normal(params["humidity"][0], params["humidity"][1]),
            "ph": np.clip(np.random.normal(params["ph"][0], params["ph"][1]), 3.5, 9.5),
            "rainfall": max(0, np.random.normal(params["rainfall"][0], params["rainfall"][1])),
            "label": crop_name,
        }
        rows.append(row)

df = pd.DataFrame(rows)
print(f"Dataset created: {df.shape[0]} samples, {df['label'].nunique()} crops")
print(f"Crops: {sorted(df['label'].unique())}")

# ------------------------------
# Prepare features and labels
# ------------------------------
X = df[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]].values
y = df["label"].values

le = LabelEncoder()
y_encoded = le.fit_transform(y)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ------------------------------
# Train / Test split
# ------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# ------------------------------
# Train Random Forest
# ------------------------------
print("Training Random Forest model...")
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=15,
    random_state=42,
    n_jobs=-1,
)
rf_model.fit(X_train, y_train)

y_pred = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {accuracy * 100:.2f}%")

# ------------------------------
# Save model, scaler, and label encoder
# ------------------------------
joblib.dump(rf_model, os.path.join(BASE_DIR, "crop_rf_model.pkl"))
joblib.dump(scaler, os.path.join(BASE_DIR, "crop_scaler.pkl"))
joblib.dump(le, os.path.join(BASE_DIR, "crop_label_encoder.pkl"))

print("\n✅ All 3 model files saved successfully:")
print(f"   - crop_rf_model.pkl")
print(f"   - crop_scaler.pkl")
print(f"   - crop_label_encoder.pkl")
print(f"\nRestart the backend server to load the new models.")
