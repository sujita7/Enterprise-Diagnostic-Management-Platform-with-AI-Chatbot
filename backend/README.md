# Hospital Management System Backend

This is the Django backend for the Hospital Management System (Phase 1: Core Booking System).

## Tech Stack
- Django 6.0.x
- Django REST Framework (DRF)
- JWT Authentication (djangorestframework-simplejwt)
- SQLite (Default database for local development)

## Setup Instructions

### 1. Prerequisites
Ensure you have Python 3 installed.

### 2. Create and Activate Virtual Environment
Navigate to the `backend` directory and run:

```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate   # On Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
*(Note: If `requirements.txt` is missing, run `pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary`)*

### 4. Database Setup
Apply the migrations to set up the SQLite database:
```bash
python manage.py makemigrations api
python manage.py migrate
```

### 5. Create Superuser (Admin)
Create an admin account to access the Django admin panel and manage Tests:
```bash
python manage.py createsuperuser
```

### 6. Run the Server
```bash
python manage.py runserver
```
The backend will be running at `http://127.0.0.1:8000/`.

---

## API Documentation

### Authentication Endpoints

#### 1. Register a new User
- **URL**: `/api/register/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "password": "securepassword123",
    "email": "johndoe@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```

#### 2. Login (Get JWT Token)
- **URL**: `/api/login/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "johndoe",
    "password": "securepassword123"
  }
  ```
- **Response**: Returns `access` and `refresh` tokens. Use the `access` token in the Authorization header for protected routes:
  `Authorization: Bearer <your_access_token>`

#### 3. Refresh Token
- **URL**: `/api/token/refresh/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "refresh": "<your_refresh_token>"
  }
  ```

#### 4. Get User Profile
- **URL**: `/api/profile/`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <your_access_token>`

---

### Core Endpoints

#### 1. List All Tests
- **URL**: `/api/tests/`
- **Method**: `GET`
- **Authentication**: Not required
- **Description**: Returns a list of all available tests.

#### 2. Get Test Details
- **URL**: `/api/tests/<id>/`
- **Method**: `GET`
- **Authentication**: Not required
- **Description**: Returns details for a specific test.

#### 3. List Bookings / Create Booking
- **URL**: `/api/bookings/`
- **Methods**: `GET`, `POST`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **GET Response**: Returns a list of bookings for the authenticated user.
- **POST Body** (Create Booking):
  ```json
  {
    "test": 1,
    "date": "2026-06-15",
    "time_slot": "10:00 AM"
  }
  ```
*(Note: The user field is automatically populated from the authenticated token)*

---

### AI Features (Phase 2)

**Note:** For full AI functionality, ensure `OPENAI_API_KEY` is set in your `.env` file. Without it, mock responses or error messages will be returned.

#### 1. AI Symptom Checker
- **URL**: `/api/ai/symptom-checker/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "symptoms": "Fever, headache, body pain"
  }
  ```
- **Response**: Returns recommended tests from the database with a disclaimer.

#### 2. AI Health Assistant Chatbot
- **URL**: `/api/ai/chat/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "message": "What is a CBC test?",
    "history": []
  }
  ```
- **Response**: Returns the chatbot's text reply.

#### 3. Smart Search (Semantic Vector Search)
- **URL**: `/api/ai/search/?q=sugar`
- **Method**: `GET`
- **Description**: Uses ChromaDB to perform semantic search against test descriptions and names.

---

### Advanced AI Features (Phase 3)

#### 4. PDF Report Analysis
- **URL**: `/api/ai/analyze-report/`
- **Method**: `POST`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `report`: The uploaded PDF file containing the lab report.
- **Response**: Returns a simplified, easy-to-understand explanation of the lab results.

#### 5. Personalized Test Suggestions
- **URL**: `/api/ai/personalized-suggestions/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "age": 45,
    "gender": "Male",
    "lifestyle": "Sedentary, smoker",
    "medical_history": "Family history of diabetes"
  }
  ```
- **Response**: Returns a list of suggested screening categories based on the user's profile.

#### 6. Health Package Generator
- **URL**: `/api/ai/package-generator/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "request": "I am 50 years old and want a full body checkup"
  }
  ```
- **Response**: Returns a custom package name and a list of recommended test objects directly from the database.

---

### Machine Learning Features (Phase 4)

#### 7. Disease Risk Prediction
- **URL**: `/api/ai/predict-risk/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "age": 45,
    "bmi": 28.5,
    "blood_pressure": 135,
    "glucose": 110
  }
  ```
- **Response**: Returns a classification predicting the patient's health risk.
  ```json
  {
    "prediction": "Medium Risk",
    "disclaimer": "WARNING: This is an automated machine learning prediction based on synthetic data for educational purposes. It is not a real medical diagnosis."
  }
  ```
*(Note: Ensure you have run `python train_model.py` at least once to generate the Random Forest model file before calling this endpoint).*

---

## Admin Panel

You can add, edit, and delete `Test` entries via the Django Admin panel at:
`http://127.0.0.1:8000/admin/`

Remember to register the models in `api/admin.py` to view them there.
