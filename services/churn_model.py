"""
Churn (Turnover) Prediction Model Service.

- Train an XGBoost classifier on employee features
- Save/load model with joblib
- Predict turnover risk scores
"""

import os
import numpy as np
from typing import List, Dict, Any
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from xgboost import XGBClassifier

# -------------------------------
# Paths
# -------------------------------
MODEL_DIR = os.getenv("MODEL_DIR", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "churn_model.joblib")

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)


# -------------------------------
# Churn Model Service
# -------------------------------
class ChurnModelService:
    def __init__(self):
        self.model = None
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)

    def train(self, X: List[List[float]], y: List[int]) -> Dict[str, Any]:
        """
        Train the churn prediction model.
        Features: [engagement_score, performance_score, tenure_months, compensation_ratio]
        Target: 0 = stay, 1 = churn
        """
        X = np.array(X)
        y = np.array(y)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        clf = XGBClassifier(
            n_estimators=200,
            max_depth=4,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            use_label_encoder=False,
            eval_metric="logloss",
            random_state=42
        )

        clf.fit(X_train, y_train)
        self.model = clf

        # Save trained model
        joblib.dump(self.model, MODEL_PATH)

        # Report
        y_pred = clf.predict(X_test)
        report = classification_report(y_test, y_pred, output_dict=True)

        return {"status": "trained", "report": report}

    def predict(self, features: List[float]) -> Dict[str, Any]:
        """
        Predict turnover risk for a single employee.
        Returns probability of churn and risk label.
        """
        if not self.model:
            raise RuntimeError("Churn model not trained or loaded.")

        probs = self.model.predict_proba([features])[0]
        churn_prob = float(probs[1])

        if churn_prob > 0.7:
            label = "high"
        elif churn_prob > 0.4:
            label = "medium"
        else:
            label = "low"

        return {
            "churn_probability": churn_prob,
            "risk_label": label
        }

    def predict_batch(self, features_batch: List[List[float]]) -> List[Dict[str, Any]]:
        """
        Predict turnover risk for a batch of employees.
        """
        if not self.model:
            raise RuntimeError("Churn model not trained or loaded.")

        probs = self.model.predict_proba(features_batch)

        results = []
        for prob in probs:
            churn_prob = float(prob[1])
            if churn_prob > 0.7:
                label = "high"
            elif churn_prob > 0.4:
                label = "medium"
            else:
                label = "low"
            results.append({
                "churn_probability": churn_prob,
                "risk_label": label
            })

        return results


# -------------------------------
# Factory
# -------------------------------
def get_churn_model() -> ChurnModelService:
    """
    Return a singleton ChurnModelService.
    """
    global _churn_service
    try:
        return _churn_service
    except NameError:
        _churn_service = ChurnModelService()
        return _churn_service
