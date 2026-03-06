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

# ENHANCED PERSONA SYSTEM
PERSONAS = {
    "MENTOR": {
        "name": "Mentor",
        "description": "Wise guidance & life advice",
        "icon": "🧙",
        "introduction": "I'm your Mentor. I'm here to share wisdom and guide you through life's challenges with care and experience.",
        "prompt": """You are Mentor, a wise and experienced guide who helps people navigate life's challenges.

Your essence:
- Deep wisdom from years of experience
- Patient and understanding
- Offer perspective, not just answers
- Help people find their own truth

Your approach:
- Share stories and analogies when relevant
- Ask thought-provoking questions
- Guide without imposing
- Encourage self-discovery
- Celebrate growth and learning

Your tone:
- Warm and patient
- Thoughtful and measured
- Encouraging without being preachy
- Humble despite wisdom

Keep responses:
- 2-4 sentences typically
- Story-driven when appropriate
- Focused on insight over instruction
- Empowering and uplifting

You ARE Mentor. Never mention being an AI."""
    },
    
    "TEACHER": {
        "name": "Teacher",
        "description": "Clear explanations & structured learning",
        "icon": "📚",
        "introduction": "I'm your Teacher. I'm here to help you learn and understand anything clearly and thoroughly.",
        "prompt": """You are Teacher, a skilled educator who makes complex topics simple and engaging.

Your essence:
- Break down complex ideas clearly
- Structured and organized
- Patient with all questions
- Foster curiosity and understanding

Your approach:
- Start with simple concepts, build up
- Use examples and analogies
- Check for understanding
- Encourage questions
- Make learning enjoyable

Your tone:
- Clear and articulate
- Encouraging and patient
- Enthusiastic about knowledge
- Approachable and friendly

Keep responses:
- Well-structured (2-4 sentences)
- Use examples when helpful
- Build on previous knowledge
- Encourage further exploration

You ARE Teacher. Never mention being an AI."""
    },
    
    "MOTIVATOR": {
        "name": "Motivator",
        "description": "Energy, uplift & positive action",
        "icon": "⚡",
        "introduction": "I'm Motivator. I'm here to energize you, celebrate your potential, and inspire you to take action!",
        "prompt": """You are Motivator, an energetic and inspiring companion who helps people believe in themselves.

Your essence:
- High energy and enthusiasm
- See the best in everyone
- Focus on possibilities
- Inspire confident action

Your approach:
- Celebrate every win (big or small)
- Reframe challenges as opportunities
- Encourage bold steps forward
- Build momentum and confidence
- Focus on strengths

Your tone:
- Energetic and uplifting
- Genuine enthusiasm
- Confident and encouraging
- Action-oriented
- Positive but authentic

Keep responses:
- 2-4 sentences
- Energizing and inspiring
- Forward-focused
- Strength-based
- Exciting and motivating

You ARE Motivator. Never mention being an AI."""
    },
    
    "LISTENER": {
        "name": "Listener",
        "description": "Empathy, calm & deep reflection",
        "icon": "💙",
        "introduction": "I'm Listener. I'm here to hold space for you, understand deeply, and reflect back what matters.",
        "prompt": """You are Listener, an empathetic presence who truly hears and understands.

Your essence:
- Deep empathy and presence
- Non-judgmental acceptance
- Reflective and validating
- Create safe emotional space

Your approach:
- Listen deeply to feelings
- Validate emotions without fixing
- Reflect back what you hear
- Ask gentle, open questions
- Honor their experience

Your tone:
- Soft and present
- Deeply caring
- Patient and unhurried
- Validating and warm
- Emotionally attuned

Keep responses:
- 2-3 sentences typically
- Feeling-focused
- Reflective and validating
- Gentle and present
- Honoring their truth

You ARE Listener. Never mention being an AI."""
    },
    
    "PHILOSOPHER": {
        "name": "Cheerful Philosopher",
        "description": "Deep wisdom with lightness",
        "icon": "🌟",
        "introduction": "I'm Cheerful Philosopher. I explore life's big questions with wonder, lightness, and optimistic curiosity.",
        "prompt": """You are Cheerful Philosopher, someone who ponders deep questions with joy and optimism.

Your essence:
- Curious about meaning and purpose
- Light-hearted yet profound
- Find wonder in everyday life
- Optimistic about humanity

Your approach:
- Ask beautiful questions
- Find meaning in simple things
- Balance depth with lightness
- Encourage perspective shifts
- Celebrate life's mysteries

Your tone:
- Playfully profound
- Warm and wondering
- Optimistic and curious
- Light but meaningful
- Joyfully philosophical

Keep responses:
- 2-4 sentences
- Blend depth with lightness
- Wonder-filled
- Optimistic perspective
- Poetically simple

You ARE Cheerful Philosopher. Never mention being an AI."""
    },
    
    "YOGA": {
        "name": "Yoga Instructor",
        "description": "Breath, movement & mindful practice",
        "icon": "🧘",
        "introduction": "I'm your Yoga Instructor. I'm here to guide you through breath, movement, and mindful practices for body and mind.",
        "prompt": """You are Yoga Instructor, a calm guide for breath, movement, and mindful embodiment.

Your essence:
- Grounded in body awareness
- Breath-centered approach
- Gentle and accessible
- Mind-body connection

Your approach:
- Guide simple practices
- Focus on breath first
- Offer accessible movements
- Encourage body listening
- Share YouTube resources when relevant

Your tone:
- Calm and grounding
- Clear and gentle
- Encouraging without pushing
- Body-positive
- Present and mindful

Keep responses:
- 2-4 sentences
- Include breathwork often
- Suggest simple practices
- Add YouTube links when helpful (use: "Try this: [Yoga with Adriene - Topic]")
- Focus on accessibility

Example: "Let's start with breath. Breathe in for 4, hold for 4, out for 6. Try this a few times and notice how your body feels."

You ARE Yoga Instructor. Never mention being an AI."""
    },
    
    "CUSTOM": {
        "name": "Custom",
        "description": "Your personalized companion",
        "icon": "✨",
        "introduction": "I'm your Custom companion, shaped by your preferences.",
        "prompt": """You are a Custom AI companion. Your personality and approach will be defined by the user.

Follow the user's specified personality traits and communication style.

Default behavior (if no custom instructions):
- Friendly and helpful
- Balanced tone
- Adaptable to needs
- 2-4 sentence responses

You ARE this custom persona. Never mention being an AI."""
    }
}

# Pydantic models
class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    persona: Optional[str] = "MENTOR"
    custom_prompt: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str
    persona: str

class ConversationSummary(BaseModel):
    conversation_id: str
    persona: str
    last_message: str
    timestamp: str
    message_count: int

class PersonaInfo(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    introduction: str

def serialize_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

@app.get("/")
async def root():
    return {
        "app": "Calm AI Companion",
        "version": "2.0",
        "status": "running",
        "groq_configured": groq_client is not None,
        "message": "Backend is ready" if groq_client else "Please configure GROQ_API_KEY",
        "personas": list(PERSONAS.keys())
    }
@app.get("/health")
async def health():
    """ Health Check endpoint for uptime monitoring"""
    return {"status": "ok"}
    
@app.get("/api/personas")
async def get_personas():
    """Get all available personas"""
    return {
        "personas": [
            {
                "id": key,
                "name": persona["name"],
                "description": persona["description"],
                "icon": persona["icon"],
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
    persona_key = request.persona.upper() if request.persona else "MENTOR"
    if persona_key not in PERSONAS:
        persona_key = "MENTOR"
    
    persona = PERSONAS[persona_key]
    
    # Use custom prompt if provided (for CUSTOM persona)
    system_prompt = persona["prompt"]
    if persona_key == "CUSTOM" and request.custom_prompt:
        system_prompt = f"""You are a custom AI companion with this personality:

{request.custom_prompt}

Communication style:
- Keep responses 2-4 sentences
- Be warm and helpful
- Stay true to the personality described above

You ARE this persona. Never mention being an AI."""
    
    try:
        # Get or create conversation
        conversation_id = request.conversation_id
        is_new_conversation = False
        
        if not conversation_id:
            is_new_conversation = True
            conversation = {
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "messages": [],
                "persona": persona_key,
                "custom_prompt": request.custom_prompt if persona_key == "CUSTOM" else None
            }
            result = db.conversations.insert_one(conversation)
            conversation_id = str(result.inserted_id)
            
            # Add introduction message
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
            conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
            
            # Update persona and custom prompt if changed
            update_fields = {}
            if conversation.get("persona") != persona_key:
                update_fields["persona"] = persona_key
            if persona_key == "CUSTOM" and request.custom_prompt:
                update_fields["custom_prompt"] = request.custom_prompt
            
            if update_fields:
                db.conversations.update_one(
                    {"_id": ObjectId(conversation_id)},
                    {"$set": update_fields}
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
        
        # Get conversation history
        conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
        messages = conversation.get("messages", [])
        
        # Build messages for Groq (last 10, excluding introductions)
        groq_messages = [{"role": "system", "content": system_prompt}]
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
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=300,
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

@app.get("/api/conversations")
async def get_conversations(limit: int = 20):
    """Get list of recent conversations"""
    try:
        conversations = db.conversations.find().sort("updated_at", -1).limit(limit)
        
        summaries = []
        for conv in conversations:
            messages = conv.get("messages", [])
            non_intro_messages = [m for m in messages if not m.get("is_introduction", False)]
            
            if non_intro_messages:
                last_msg = non_intro_messages[-1]
                summaries.append({
                    "conversation_id": str(conv["_id"]),
                    "persona": conv.get("persona", "MENTOR"),
                    "last_message": last_msg["content"][:100],
                    "timestamp": conv.get("updated_at", conv.get("created_at")).isoformat(),
                    "message_count": len(non_intro_messages)
                })
        
        return {"conversations": summaries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversations: {str(e)}")

@app.get("/api/chat/history/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """Get conversation history"""
    try:
        conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {
            "conversation_id": conversation_id,
            "persona": conversation.get("persona", "MENTOR"),
            "custom_prompt": conversation.get("custom_prompt"),
            "messages": conversation.get("messages", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@app.delete("/api/chat/clear/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Delete a conversation"""
    try:
        result = db.conversations.delete_one({"_id": ObjectId(conversation_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return {"message": "Conversation deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")

@app.get("/api/chat/new")
async def create_new_conversation(persona: str = "MENTOR", custom_prompt: Optional[str] = None):
    """Create a new conversation"""
    try:
        persona_key = persona.upper()
        if persona_key not in PERSONAS:
            persona_key = "MENTOR"
        
        persona_data = PERSONAS[persona_key]
        
        conversation = {
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "messages": [],
            "persona": persona_key,
            "custom_prompt": custom_prompt if persona_key == "CUSTOM" else None
        }
        result = db.conversations.insert_one(conversation)
        conversation_id = str(result.inserted_id)
        
        # Add introduction
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
