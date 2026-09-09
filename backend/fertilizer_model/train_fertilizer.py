import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Standard fertilizer dataset categories
fertilizers = ["Urea", "DAP", "14-35-14", "28-28", "17-17-17", "20-20", "10-26-26"]
soil_types = ["sandy", "loamy", "black", "red", "clayey"]
crop_types = ["maize", "sugarcane", "cotton", "tobacco", "paddy", "barley", "wheat", "millets", "oil seeds", "pulses", "ground nuts"]

np.random.seed(42)
rows = []
for _ in range(1000):
    fert = np.random.choice(fertilizers)
    soil = np.random.choice(soil_types)
    crop = np.random.choice(crop_types)
    
    # Generate realistic N, P, K, Temp, Humidity, Moisture based on fertilizer type
    if fert == "Urea":
        n = np.random.randint(35, 50)
        p = np.random.randint(0, 15)
        k = np.random.randint(0, 15)
    elif fert == "DAP":
        n = np.random.randint(15, 25)
        p = np.random.randint(40, 55)
        k = np.random.randint(0, 15)
    else:
        n = np.random.randint(10, 30)
        p = np.random.randint(10, 35)
        k = np.random.randint(10, 35)
        
    temp = round(np.random.uniform(20.0, 38.0), 1)
    humidity = round(np.random.uniform(40.0, 85.0), 1)
    moisture = np.random.randint(25, 70)
    
    rows.append({
        "N": n, "P": p, "K": k,
        "Temperature": temp, "Humidity": humidity,
        "Moisture": moisture,
        "Soil_Type": soil, "Crop_Type": crop,
        "Fertilizer": fert
    })

df = pd.DataFrame(rows)

numeric_features = ["N", "P", "K", "Temperature", "Humidity", "Moisture"]
categorical_features = ["Soil_Type", "Crop_Type"]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numeric_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
])

le = LabelEncoder()
y = le.fit_transform(df["Fertilizer"])
X = df[numeric_features + categorical_features]

pipeline.fit(X, y)

joblib.dump(pipeline, os.path.join(BASE_DIR, "fertilizer_pipeline.pkl"))
joblib.dump(le, os.path.join(BASE_DIR, "label_encoder.pkl"))

print("✅ Fertilizer model & pipeline saved successfully!")
