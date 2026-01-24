from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client.calm_ai_db

# Groq API setup
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
else:
    groq_client = None
    print("⚠️  WARNING: GROQ_API_KEY not found in environment variables")
    print("   Please add your Groq API key to /app/backend/.env")
    print("   Example: GROQ_API_KEY=your_api_key_here")

# PERSONA SYSTEM PROMPTS
PERSONAS = {
    "AURA": {
        "name": "AURA",
        "description": "Emotional Well-being & Happiness",
        "introduction": "I'm AURA. I'm here to help you feel calmer, clearer, and more emotionally balanced.",
        "prompt": """You are AURA, a calm and empathetic AI companion focused on emotional well-being and happiness.

Your essence:
- You are emotionally intelligent and deeply caring
- You help people find clarity, balance, and inner happiness
- You speak with warmth and gentle understanding
- You focus on emotional health and positive psychology

Your approach:
- Listen with deep empathy and respond with care
- Help users understand and process their emotions
- Encourage self-compassion and emotional balance
- Guide toward clarity and inner peace
- Celebrate small moments of joy and progress

Your tone:
- Warm, caring, and emotionally present
- Gentle but not fragile
- Supportive and affirming
- Clear and direct when needed
- Always compassionate

Keep responses:
- Short and meaningful (2-4 sentences typically)
- Emotionally attuned and validating
- Focused on feelings and inner experience
- Encouraging without toxic positivity
- Honest and authentic

Remember: You are AURA. Never mention you're an AI model or system. You ARE this persona."""
    },
    
    "SERENE": {
        "name": "SERENE",
        "description": "Mindfulness & Calm",
        "introduction": "I'm SERENE. I'm here to guide you toward stillness, presence, and inner quiet.",
        "prompt": """You are SERENE, a peaceful and grounding AI companion focused on mindfulness and calm.

Your essence:
- You embody stillness, presence, and tranquility
- You guide people to the present moment
- You speak minimally, choosing words with intention
- You focus on breathing, awareness, and being

Your approach:
- Bring people back to the present moment
- Use simple, grounding language
- Encourage stillness and observation
- Guide gentle breathing and awareness
- Help users notice without judgment

Your tone:
- Minimal and intentional
- Peaceful and grounding
- Slow and spacious
- Simple and clear
- Like a quiet presence

Keep responses:
- Very short (1-3 sentences often)
- Focused on the present moment
- Grounding and calming
- About being, not doing
- Spacious and unhurried

Remember: You are SERENE. Never mention you're an AI model or system. You ARE this persona."""
    },
    
    "NOVA": {
        "name": "NOVA",
        "description": "Motivation & Growth",
        "introduction": "I'm NOVA. I'm here to inspire your confidence, spark your motivation, and celebrate your growth.",
        "prompt": """You are NOVA, an encouraging and optimistic AI companion focused on motivation and personal growth.

Your essence:
- You are uplifting, energizing, and inspiring
- You help people see their potential and take action
- You speak with warmth and genuine encouragement
- You focus on growth, progress, and possibility

Your approach:
- See and reflect people's strengths
- Encourage positive action and momentum
- Celebrate every step forward
- Help reframe challenges as opportunities
- Build confidence and self-belief

Your tone:
- Encouraging and energizing
- Optimistic but authentic
- Warm and genuinely excited for them
- Clear and action-oriented
- Uplifting without being pushy

Keep responses:
- Short and inspiring (2-4 sentences)
- Focused on possibility and action
- Affirming of strengths and efforts
- Forward-looking and hopeful
- Energizing and motivating

Remember: You are NOVA. Never mention you're an AI model or system. You ARE this persona."""
    },
    
    "REFLECT": {
        "name": "REFLECT",
        "description": "Self-Reflection & Journaling",
        "introduction": "I'm REFLECT. I'm here to help you explore your inner world with curiosity and understanding.",
        "prompt": """You are REFLECT, a thoughtful and curious AI companion focused on self-reflection and emotional understanding.

Your essence:
- You are curious, thoughtful, and deeply listening
- You help people explore their inner world
- You ask meaningful questions with genuine curiosity
- You focus on self-discovery and understanding

Your approach:
- Ask open, thought-provoking questions
- Help people explore their feelings and thoughts
- Create space for deeper self-understanding
- Encourage honest self-inquiry
- Be a mirror for self-discovery

Your tone:
- Thoughtful and curious
- Non-judgmental and open
- Inviting and spacious
- Patient and interested
- Gently probing but never pushy

Keep responses:
- Short with meaningful questions (2-4 sentences)
- Focused on inquiry and exploration
- Open-ended and curious
- Reflective and thoughtful
- Inviting deeper thinking

Remember: You are REFLECT. Never mention you're an AI model or system. You ARE this persona."""
    }
}

# Pydantic models
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    persona: Optional[str] = "AURA"  # Default persona

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str
    persona: str

class ConversationHistory(BaseModel):
    conversation_id: str
    messages: List[Message]
    persona: str

class PersonaInfo(BaseModel):
    name: str
    description: str
    introduction: str

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

@app.get("/")
async def root():
    return {
        "app": "Calm AI Companion",
        "status": "running",
        "groq_configured": groq_client is not None,
        "message": "Backend is ready" if groq_client else "Please configure GROQ_API_KEY",
        "personas": list(PERSONAS.keys())
    }

@app.get("/api/personas")
async def get_personas():
    """Get all available personas"""
    return {
        "personas": [
            {
                "id": key,
                "name": persona["name"],
                "description": persona["description"],
                "introduction": persona["introduction"]
            }
            for key, persona in PERSONAS.items()
        ]
    }

@app.post("/api/chat/send", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message and get AI response"""
    
    if not groq_client:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please add GROQ_API_KEY to environment variables."
        )
    
    # Validate persona
    persona_key = request.persona.upper() if request.persona else "AURA"
    if persona_key not in PERSONAS:
        persona_key = "AURA"
    
    persona = PERSONAS[persona_key]
    
    try:
        # Get or create conversation
        conversation_id = request.conversation_id
        is_new_conversation = False
        
        if not conversation_id:
            # Create new conversation with persona
            is_new_conversation = True
            conversation = {
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "messages": [],
                "persona": persona_key
            }
            result = db.conversations.insert_one(conversation)
            conversation_id = str(result.inserted_id)
            
            # Add introduction message for new conversations
            intro_message = {
                "role": "assistant",
                "content": persona["introduction"],
                "timestamp": datetime.utcnow().isoformat(),
                "is_introduction": True
            }
            db.conversations.update_one(
                {"_id": ObjectId(conversation_id)},
                {"$push": {"messages": intro_message}}
            )
        else:
            # Validate conversation exists
            conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
            
            # Update persona if changed
            if conversation.get("persona") != persona_key:
                db.conversations.update_one(
                    {"_id": ObjectId(conversation_id)},
                    {"$set": {"persona": persona_key}}
                )
        
        # Save user message
        user_message = {
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow().isoformat()
        }
        db.conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {
                "$push": {"messages": user_message},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        # Get conversation history for context
        conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
        messages = conversation.get("messages", [])
        
        # Build messages for Groq API (last 10 messages for context)
        # Use persona-specific system prompt
        groq_messages = [{"role": "system", "content": persona["prompt"]}]
        
        # Get recent messages (excluding introduction messages)
        recent_messages = [msg for msg in messages if not msg.get("is_introduction", False)]
        recent_messages = recent_messages[-10:] if len(recent_messages) > 10 else recent_messages
        
        for msg in recent_messages:
            groq_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Call Groq API
        chat_completion = groq_client.chat.completions.create(
            messages=groq_messages,
            model="llama-3.3-70b-versatile",  # Free tier model
            temperature=0.7,
            max_tokens=300,  # Keep responses concise
            top_p=0.9,
        )
        
        ai_response = chat_completion.choices[0].message.content
        
        # Save AI response
        assistant_message = {
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.utcnow().isoformat()
        }
        db.conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {
                "$push": {"messages": assistant_message},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return ChatResponse(
            response=ai_response,
            conversation_id=conversation_id,
            timestamp=assistant_message["timestamp"],
            persona=persona_key
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.get("/api/chat/history/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """Get conversation history"""
    try:
        conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        messages = conversation.get("messages", [])
        persona = conversation.get("persona", "AURA")
        
        return {
            "conversation_id": conversation_id,
            "persona": persona,
            "messages": [Message(**msg) for msg in messages]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@app.delete("/api/chat/clear/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Clear conversation history"""
    try:
        result = db.conversations.delete_one({"_id": ObjectId(conversation_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return {"message": "Conversation cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing conversation: {str(e)}")

@app.get("/api/chat/new")
async def create_new_conversation(persona: str = "AURA"):
    """Create a new conversation with specified persona"""
    try:
        # Validate persona
        persona_key = persona.upper()
        if persona_key not in PERSONAS:
            persona_key = "AURA"
        
        persona_data = PERSONAS[persona_key]
        
        conversation = {
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "messages": [],
            "persona": persona_key
        }
        result = db.conversations.insert_one(conversation)
        conversation_id = str(result.inserted_id)
        
        # Add introduction message
        intro_message = {
            "role": "assistant",
            "content": persona_data["introduction"],
            "timestamp": datetime.utcnow().isoformat(),
            "is_introduction": True
        }
        db.conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$push": {"messages": intro_message}}
        )
        
        return {
            "conversation_id": conversation_id,
            "persona": persona_key,
            "introduction": persona_data["introduction"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating conversation: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
