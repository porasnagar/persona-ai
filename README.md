# 🌙 Persona AI – Calm AI Companion

A multi-persona conversational AI mobile application designed to provide guidance, emotional support, and learning through specialized AI personalities.

---

## 🚀 Overview

Persona AI allows users to interact with different AI personas such as:

- Mentor  
- Teacher  
- Motivator  
- Listener  
- Cheerful Philosopher  
- Yoga Instructor  
- Custom Persona  

Each persona is powered by a structured prompt system to simulate different styles of conversation and guidance.

---

## 🧠 Key Features

- 🎭 Multi-persona AI system  
- 💬 Real-time conversational chat  
- 📱 Cross-platform mobile app (Android / iOS via Expo)  
- 🧘 Calm, minimal UI design  
- 💾 Chat persistence (stored on device)  
- 🔊 Text-to-speech support (Expo Speech)  
- ☁️ Backend AI inference using Groq  
- ⚡ Fast responses via Groq LLM  

---

## 🏗 Architecture

---

## 🛠 Tech Stack

### Frontend
- React Native
- Expo
- Expo Router
- AsyncStorage (chat persistence)
- Expo Speech

### Backend
- Python (REST API)
- Render (deployment)

### AI Layer
- Groq API (LLM inference)

### Monitoring
- UptimeRobot (keeps backend active)

---

## 📱 App Flow

1. User opens the app  
2. Selects a persona  
3. Starts a conversation  
4. Sends message  
5. Backend processes request  
6. Groq generates response  
7. Response displayed in chat  

---

## 🎭 Persona System

Each persona modifies AI behavior using structured prompts.

### Example Personas

**Mentor**  
Provides thoughtful life guidance and reflection.

**Teacher**  
Explains concepts clearly and step-by-step.

**Motivator**  
Encourages action and confidence.

**Listener**  
Focuses on empathy and emotional understanding.

**Philosopher**  
Reflects on life and meaning.

**Yoga Instructor**  
Suggests breathing and mindfulness exercises.

---

## 🔊 Voice Features

- ✅ Text-to-speech works  
- ⚠️ Microphone input currently not working (build issue)

---

## 💾 Chat Storage

- Chats are stored locally using AsyncStorage  
- Conversations persist across navigation  

---

## ⚙️ Deployment

### Backend
- Hosted on Render  
- Uses Groq API key via environment variables  

### Mobile App
- Built using Expo EAS  
- OTA updates supported via EAS Update  

---

## 📡 Backend Monitoring

- UptimeRobot pings backend every 5 minutes  
- Prevents Render free-tier sleep  

---

## ⚠️ Known Issues

- Microphone input not functional (build issue)  
- UI alignment improvements needed  
- First request delay due to backend cold start  

---

## 🔮 Future Improvements

- 🎙 Voice input support  
- ☁️ Cloud chat storage  
- 🎨 UI refinements  
- 🧠 Advanced persona customization  
- 🔐 Authentication improvements  

---

## 📄 Documentation

Full system documentation available in PDF:

- persona_ai_system_documentation.pdf  
- persona_ai_system_documentation_v2.pdf  

---

## 🧪 Setup Guide

👉 Check setup guide for more information

---

## 👨‍💻 Author

Developed as a multi-persona AI companion system using modern LLM architecture and mobile-first design.

---

## ⭐ Final Note

Persona AI demonstrates how structured personas can transform a generic AI into a more human-like and role-based conversational experience.
