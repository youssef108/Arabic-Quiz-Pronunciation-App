# Quraan Voice Quiz

## Description
Quraan Voice Quiz is a web-based application that presents a series of questions to users. The application captures the user's spoken answers using speech recognition and provides immediate feedback. Users can proceed to the next question, get the correct pronunciation of the answer, and see a summary of their attempts at the end of the quiz.

## Features
- Voice-based interaction for answering quiz questions.
- Real-time feedback on the correctness of the answer.
- Ability to add multiple questions to the Quiz.
- Ability to pronounce the correct answer.
- Summary of total attempts, correct attempts, and wrong attempts at the end of the quiz.

## Dependencies
- Python 3.7+
- Flask
- SpeechRecognition
- gTTS
- pyaudio (required for SpeechRecognition)
- HTML, CSS, JavaScript (for the frontend)
- Font Awesome (for icons)

## Installation Instructions

### 1. Clone the repository
```bash
git clone https://github.com/youssef108/Arabic-Quiz-Pronunciation-App.git
cd Arabic-Quiz-Pronunciation-App
```

### 2. Install the required Python packages
```bash
pip install Flask SpeechRecognition gTTS pyaudio
```

### 3. Create questions.json file 
- the file already exists with some questions 
- you can add questions , follow the same format for the app to work properly 

### 4. Run the Application
```bash
python app.py
```
### 5. Access the application
Open a web browser and go to http://127.0.0.1:5000/ to access the Quraan Voice Quiz application.

## Usage Instructions
- Click on the "Start Recording" button to begin answering the quiz questions.
- Speak your answer clearly into the microphone.
- You will receive immediate feedback. A green checkmark will appear if the answer is correct, and a red X will appear if the answer is incorrect.
- If incorrect, you can click on the "Pronounce Answer" button to hear the correct pronunciation.
- Click on the "Continue" button to proceed to the next question.
- After all questions are answered, a summary will be displayed with your total attempts, correct attempts, and wrong attempts.
## Known Issues
- Speech recognition accuracy may vary based on the quality of the microphone, ambient noise, and the clarity of the user's speech.
- Network issues can affect the performance of the speech recognition service.
## Areas of Improvement
- Enhance error handling and feedback for different types of errors.
- Improve UI with better animations and visual cues.
- Customization options for quiz settings.

