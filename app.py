from flask import Flask, render_template, request, jsonify, send_file
import speech_recognition as sr
import threading
import json
from gtts import gTTS
import os

app = Flask(__name__)
recognizer = sr.Recognizer()
is_listening = False
recognized_text = ""
current_question_index = 0
total_attempts = 0
correct_attempts = 0
wrong_attempts = 0

def listen_and_recognize():
    global recognized_text, is_listening, recognizer, total_attempts, correct_attempts, wrong_attempts
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        try:
            print("Listening...")
            audio_data = recognizer.listen(source, timeout=5, phrase_time_limit=3)
            recognized_text = recognizer.recognize_google(audio_data, language="ar-SA")
            print("Recognized Text: ", recognized_text)
            total_attempts += 1
            if recognized_text == load_questions()[current_question_index]['answer']:
                correct_attempts += 1
            else:
                wrong_attempts += 1
        except sr.UnknownValueError:
            recognized_text = "Couldn't hear you well, could you repeat that?"
            print(recognized_text)
        except sr.RequestError as e:
            recognized_text = f"Could not request results from Google Web Speech API; {e}"
            print(recognized_text)
        finally:
            is_listening = False  # Ensure listening stops after handling exceptions

def load_questions():
    with open('questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    return questions

@app.route('/')
def index():
    global current_question_index, total_attempts, correct_attempts, wrong_attempts
    current_question_index = 0  # Reset the question index when loading the main page
    total_attempts = 0
    correct_attempts = 0
    wrong_attempts = 0
    return render_template('index.html')

@app.route('/toggle_listening', methods=['POST'])
def toggle_listening():
    global is_listening, recognized_text
    if is_listening:
        is_listening = False
    else:
        is_listening = True
        recognized_text = ""  # Clear previous text
        listen_thread = threading.Thread(target=listen_and_recognize)
        listen_thread.start()
    return jsonify({'listening': is_listening, 'text': recognized_text})

@app.route('/get_text', methods=['GET'])
def get_text():
    global recognized_text, is_listening, current_question_index
    questions = load_questions()
    if current_question_index < len(questions):
        question = questions[current_question_index]
        answer = question['answer']
        complete_sentence = question['complete_sentence']
        return jsonify({'text': recognized_text, 'listening': is_listening, 'answer': answer, 'complete_sentence': complete_sentence})
    return jsonify({'text': recognized_text, 'listening': is_listening})

@app.route('/get_question', methods=['GET'])
def get_question():
    global current_question_index
    questions = load_questions()
    if current_question_index < len(questions):
        question = questions[current_question_index]
        return jsonify(question)
    else:
        return jsonify({"end": True, "total_attempts": total_attempts, "correct_attempts": correct_attempts, "wrong_attempts": wrong_attempts})

@app.route('/next_question', methods=['POST'])
def next_question():
    global current_question_index
    questions = load_questions()
    if current_question_index < len(questions) - 1:
        current_question_index += 1
    else:
        current_question_index += 1
    return jsonify({'status': 'success'})

@app.route('/pronounce_answer', methods=['GET'])
def pronounce_answer():
    questions = load_questions()
    answer = questions[current_question_index]['answer']
    tts = gTTS(text=answer, lang='ar')
    tts.save("answer.mp3")
    return send_file("answer.mp3")

if __name__ == '__main__':
    app.run(debug=True)
