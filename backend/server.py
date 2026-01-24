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

# System prompt for happiness & well-being focused AI
SYSTEM_PROMPT = """You are a calm, compassionate AI companion focused on emotional well-being, mindfulness, and inner peace.

Your purpose:
- Help users find clarity and calm in their thoughts
- Encourage gratitude, reflection, and positive mindset
- Offer gentle guidance without being pushy
- Listen with empathy and respond with warmth
- Keep responses short, thoughtful, and soothing

Your tone:
- Warm and gentle
- Present and mindful
- Supportive without being clinical
- Encouraging but never forceful
- Use simple, peaceful language

Topics you focus on:
- Emotional clarity and self-awareness
- Gratitude and appreciation
- Mindfulness and presence
- Inner peace and calm
- Personal reflection and growth

Keep your responses:
- Short (2-4 sentences typically)
- Thoughtful and meaningful
- Easy to read and digest
- Focused on the present moment
- Encouraging positive perspective

Remember: You're here to bring peace and clarity, not solve complex problems. Be a calm presence."""

# Pydantic models
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str

class ConversationHistory(BaseModel):
    conversation_id: str
    messages: List[Message]

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
        "message": "Backend is ready" if groq_client else "Please configure GROQ_API_KEY"
    }

@app.post("/api/chat/send", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message and get AI response"""
    
    if not groq_client:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please add GROQ_API_KEY to environment variables."
        )
    
    try:
        # Get or create conversation
        conversation_id = request.conversation_id
        if not conversation_id:
            # Create new conversation
            conversation = {
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "messages": []
            }
            result = db.conversations.insert_one(conversation)
            conversation_id = str(result.inserted_id)
        else:
            # Validate conversation exists
            conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
        
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
        groq_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        recent_messages = messages[-10:] if len(messages) > 10 else messages
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
            timestamp=assistant_message["timestamp"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.get("/api/chat/history/{conversation_id}", response_model=ConversationHistory)
async def get_conversation_history(conversation_id: str):
    """Get conversation history"""
    try:
        conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        messages = conversation.get("messages", [])
        return ConversationHistory(
            conversation_id=conversation_id,
            messages=[Message(**msg) for msg in messages]
        )
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
async def create_new_conversation():
    """Create a new conversation"""
    try:
        conversation = {
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "messages": []
        }
        result = db.conversations.insert_one(conversation)
        return {"conversation_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating conversation: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)