# Heart Disease Prediction using Machine Learning

This project aims to build an **end-to-end machine learning pipeline** that predicts the presence of **heart disease** based on a person's medical attributes. It leverages Python-based data science and ML libraries to explore, train, and evaluate various classification models.

---

## 1. Problem Statement

**Can we predict the presence of heart disease given a set of clinical parameters?**

This is a binary classification problem with high real-world relevance, where ML models can support doctors in early diagnosis and decision-making.

---

## 2. Dataset

- **Source**: [UCI Machine Learning Repository – Cleveland dataset](https://archive.ics.uci.edu/dataset/45/heart+disease)  
- Also available via [Kaggle](https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data)

The dataset contains 303 samples and 14 features including:
- Age
- Sex
- Chest pain type
- Resting blood pressure
- Serum cholesterol
- Fasting blood sugar
- Resting ECG results
- Max heart rate achieved
- Exercise-induced angina
- ST depression, etc.

---

## 3. Project Pipeline

The project follows a structured ML workflow:

1. **Problem Definition**
2. **Data Collection & Analysis**
3. **Data Preprocessing**
4. **Exploratory Data Analysis**
5. **Model Training**
6. **Evaluation and Experimentation**

---

## 4. ML Models Used

- **Logistic Regression**
- **Random Forest Classifier**
- **K-Nearest Neighbors**

---

## 5. Evaluation Metrics

- **Accuracy**
- **Precision**
- **Recall**
- **F1 Score**
- **ROC-AUC Score**
- **Confusion Matrix**
- **ROC Curves**

 Achieved **~89% accuracy** using Logistic Regression and Random Forest Classifier.

---

## 6. Key Visuals

- **Correlation Heatmap**
- **Feature Importance Plot**
- **ROC Curves for all models**
- **Confusion Matrices**

These helped interpret the model behavior and explain the decision-making process.

---

## 7. Tech Stack

- Python
- Jupyter Notebook
- Pandas, NumPy
- Matplotlib, Seaborn
- Scikit-learn
- RandomForestClassifier
- LogisticRegression
- KNN

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/heart-disease-classification.git
   cd heart-disease-classification
2. Install the required packages: 
   
    pip install -r requirements.txt
3. Run the notebook using jupyter: 
   
   jupyter notebook


## Feedback & Collaboration: 
I’m always open to feedback, suggestions, and collaboration—especially from those working in healthcare AI. Feel free to connect or fork the repo!

## Credits:

**UCI Machine Learning Repository**
**Kaggle Dataset Contributors**
