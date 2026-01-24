# 🌙 Calm AI Companion - Your Mindful Well-Being Assistant

A premium, Apple-inspired AI assistant mobile app focused on happiness, emotional well-being, and mental clarity. Built with Expo, FastAPI, and Groq AI.

## ✨ Features

### Premium Apple-Style Liquid Glass UI
- **Glassmorphism Design** - Heavy blur effects with translucent layers
- **Animated Liquid Orb** - Gentle floating AI presence with soft glow
- **Deep Midnight Gradient** - Calming navy/blue color palette
- **Smooth Animations** - Slow, soothing transitions
- **Generous Spacing** - Breathing room for peaceful experience

### Emotional Well-Being Focus
- **Compassionate AI Persona** - Warm, gentle, supportive responses
- **Mindfulness Topics** - Calm, Reflect, Focus, Gratitude
- **Short Thoughtful Responses** - Easy to digest, meaningful content
- **Positive Psychology** - Encourages clarity, peace, and happiness

### Technical Features
- ✅ **Groq API Integration** - Fast, free LLM inference
- ✅ **Conversation Persistence** - MongoDB-backed chat history
- ✅ **Real-time Chat** - Instant AI responses
- ✅ **Cross-Platform** - iOS, Android, Web
- ✅ **Modular Architecture** - Clean separation of concerns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB (included in container)
- **Groq API Key** (FREE - Get from [console.groq.com](https://console.groq.com/keys))

### Step 1: Get Your Free Groq API Key

1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up for a free account (no credit card required)
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Backend

Add your Groq API key to the backend environment:

```bash
# Edit /app/backend/.env
nano /app/backend/.env
```

Add this line (replace with your actual key):
```bash
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

### Step 3: Install & Run

The app is already running! Just restart the backend to load your API key:

```bash
sudo supervisorctl restart backend
```

### Step 4: Access the App

- **Web Preview**: http://localhost:3000
- **Expo Go**: Scan QR code from terminal
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal

## 📱 Screens

### 1. Welcome Screen
- Centered glowing liquid orb
- "Your Calm AI Companion" 
- Subtitle: "Find clarity, peace, and happiness through mindful conversation"
- Glass "Get Started" button

### 2. Home Screen
- Large floating animated orb
- "I'm here. Take a breath."
- Topic chips: Calm, Reflect, Focus, Gratitude
- Glass input bar with mic button

### 3. Chat Screen
- Real-time conversation with AI
- Glass-style message bubbles
- AI messages with soft glow
- Action buttons (like, copy)
- Loading indicator while AI thinks
- Smooth auto-scroll

## 🎨 Design System

### Colors
```typescript
Background Gradient: #070b1f → #0d1228 → #151a35
Primary Cyan: #5eb3e0
Primary Blue: #4a9fd8
Primary Purple: #7a8fe8
Glass Effects: rgba(255, 255, 255, 0.05-0.15)
```

### Typography
- **Hero**: 36px, weight 600 (Welcome title)
- **Title**: 26px, weight 600 (Home prompt)
- **Body**: 17px, weight 400 (Messages)
- **Caption**: 15px, weight 400 (Subtitles)

### Spacing
- xs: 6px, sm: 12px, md: 20px, lg: 28px, xl: 40px, xxl: 56px, xxxl: 72px

### Animations
- **Floating Orb**: 4s loop, ±15px vertical movement
- **Pulse**: 3s loop, 1.0 → 1.08 scale
- **Glow**: 2.5s loop, opacity 0.6 → 1.0

## 🧠 AI Persona

The AI is configured with a compassionate well-being persona:

**Purpose:**
- Emotional support and clarity
- Mindfulness and calm
- Gratitude and positivity
- Gentle guidance (not pushy)

**Tone:**
- Warm and gentle
- Present and mindful
- Supportive without being clinical
- Simple, peaceful language

**Response Style:**
- Short (2-4 sentences typically)
- Thoughtful and meaningful
- Easy to read and digest
- Focused on present moment

## 🏗 Architecture

### Backend (FastAPI + Groq)
```
/app/backend/
├── server.py          # Main API server
├── .env              # Environment variables (add your GROQ_API_KEY here)
└── requirements.txt  # Python dependencies
```

**API Endpoints:**
- `POST /api/chat/send` - Send message, get AI response
- `GET /api/chat/history/{id}` - Get conversation history
- `DELETE /api/chat/clear/{id}` - Clear conversation
- `GET /api/chat/new` - Create new conversation

### Frontend (Expo + React Native)
```
/app/frontend/
├── app/
│   ├── index.tsx      # Welcome screen
│   ├── home.tsx       # Home/prompt screen
│   └── chat.tsx       # Chat screen with API integration
├── components/
│   ├── GlowingOrb.tsx     # Animated AI orb
│   ├── GlassButton.tsx    # Glass button component
│   ├── GlassInput.tsx     # Glass input bar
│   ├── TopicChip.tsx      # Topic selection chips
│   └── ChatBubble.tsx     # Chat message bubbles
└── constants/
    └── theme.ts           # Design system (colors, spacing, typography)
```

### Database (MongoDB)
```javascript
// Conversations Collection
{
  _id: ObjectId,
  created_at: DateTime,
  updated_at: DateTime,
  messages: [
    {
      role: "user" | "assistant",
      content: string,
      timestamp: string
    }
  ]
}
```

## 🔧 Configuration

### Groq Model
Currently using: `llama-3.3-70b-versatile`
- Free tier
- Fast inference
- High quality responses
- Context window: 8,192 tokens

To change model, edit `/app/backend/server.py`:
```python
chat_completion = groq_client.chat.completions.create(
    messages=groq_messages,
    model="llama-3.3-70b-versatile",  # Change this
    temperature=0.7,
    max_tokens=300,
)
```

### System Prompt
Customize the AI persona in `/app/backend/server.py`:
```python
SYSTEM_PROMPT = """You are a calm, compassionate AI companion..."""
```

### UI Theme
Customize colors, spacing, and typography in `/app/frontend/constants/theme.ts`

## 📦 Dependencies

### Backend
- `fastapi` - Modern Python web framework
- `groq` - Groq AI Python SDK
- `pymongo` - MongoDB driver
- `uvicorn` - ASGI server
- `python-dotenv` - Environment variables

### Frontend
- `expo` ~54.0 - React Native framework
- `expo-router` ~5.1 - File-based routing
- `expo-linear-gradient` - Gradient backgrounds
- `react-native-svg` - Vector graphics for orb
- `@expo/vector-icons` - Ionicons
- `react-native-safe-area-context` - Safe area handling

## 🧪 Testing

### Test Backend API
```bash
# Check backend status
curl http://localhost:8001/

# Send a test message
curl -X POST http://localhost:8001/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Test Frontend
```bash
# Restart frontend
sudo supervisorctl restart expo

# Check logs
tail -f /var/log/supervisor/expo.err.log
```

## 🐛 Troubleshooting

### "AI service not configured" Error
**Solution**: Add your GROQ_API_KEY to `/app/backend/.env` and restart backend:
```bash
echo "GROQ_API_KEY=gsk_your_key_here" >> /app/backend/.env
sudo supervisorctl restart backend
```

### Backend Warning Message
If you see: "⚠️ WARNING: GROQ_API_KEY not found"
- This is expected until you add your API key
- The app will show an error message when trying to chat
- Add your key and restart as shown above

### Frontend Not Loading
```bash
# Clear metro cache and restart
cd /app/frontend
rm -rf .expo node_modules/.cache
sudo supervisorctl restart expo
```

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo supervisorctl status mongodb

# Restart if needed
sudo supervisorctl restart mongodb
```

## 🎯 Key Files to Customize

1. **AI Persona**: `/app/backend/server.py` (SYSTEM_PROMPT)
2. **Theme Colors**: `/app/frontend/constants/theme.ts`
3. **Welcome Text**: `/app/frontend/app/index.tsx`
4. **Home Prompt**: `/app/frontend/app/home.tsx`
5. **Topic Chips**: `/app/frontend/app/home.tsx` (topics array)

## 📝 Environment Variables

### Backend (.env)
```bash
MONGO_URL=mongodb://localhost:27017
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (.env)
```bash
EXPO_PACKAGER_PROXY_URL=... (auto-configured)
EXPO_PACKAGER_HOSTNAME=... (auto-configured)
EXPO_PUBLIC_BACKEND_URL=... (auto-configured)
```

## 🚢 Deployment

The app is containerized and ready for deployment:
- Backend runs on port 8001
- Frontend runs on port 3000
- MongoDB on port 27017
- All services managed by supervisord

## 💡 Usage Tips

1. **First Time Setup**: Get your free Groq API key and add it to backend/.env
2. **Restart Backend**: After adding API key, restart backend service
3. **Test Connection**: Open chat screen and send a test message
4. **Customize Persona**: Edit SYSTEM_PROMPT for different AI personality
5. **Change Topics**: Modify topic chips to match your use case

## 🎨 Design Philosophy

This app prioritizes:
- **Calmness** over excitement
- **Clarity** over complexity
- **Mindfulness** over productivity
- **Breathing space** over density
- **Gentle motion** over flashy animations
- **Emotional support** over problem-solving

## 📄 License

This project is built for educational and personal use.

## 🙏 Credits

- **Groq AI** - Fast, free LLM inference
- **Expo** - React Native framework
- **FastAPI** - Python web framework
- **MongoDB** - Database

---

**Ready to find calm?** Add your GROQ_API_KEY and start your journey toward clarity and peace. 🌙✨
