import os
from typing import List
from openai import AsyncOpenAI
from qdrant_client import QdrantClient
from app.core.config import settings

class AIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self.client = AsyncOpenAI(api_key=api_key)
        else:
            self.client = None
            print("Warning: OPENAI_API_KEY not set. AI features will be disabled.")
        # Connect to Qdrant (using the service name from docker-compose)
        self.qdrant = QdrantClient(url="http://qdrant:6333")
        self.collection_name = "course_content"

    async def chat(self, query: str, context: str = "") -> str:
        """
        Simple chat function. In a real RAG pipeline, we would:
        1. Embed the query.
        2. Search Qdrant for relevant chunks.
        3. Pass chunks as context to the LLM.
        """
        try:
            if not self.client:
                return "AI features are currently disabled (OpenAI API Key missing)."
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful AI Tutor for this course."},
                    {"role": "user", "content": f"Context: {context}\n\nQuestion: {query}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"AI Error: {e}")
            return "I'm sorry, I couldn't process that request. Please check your API Key."

    async def transcribe_video(self, file_path: str) -> str:
        """
        Transcribes a video file using OpenAI Whisper.
        """
        try:
            if not self.client:
                return ""
            with open(file_path, "rb") as audio_file:
                transcript = await self.client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio_file
                )
            return transcript.text
        except Exception as e:
            print(f"Transcription Error: {e}")
            return ""

ai_service = AIService()
