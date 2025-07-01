from dotenv import load_dotenv
import logging
import asyncio
import json 
from livekit.rtc import DataPacket, DataPacketKind
from livekit import agents
from livekit.agents import Agent, AgentSession, RoomInputOptions, RunContext, function_tool
from livekit.plugins import google

from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from features import get_weather, search_web, send_email
from memory_system import MemorySystem

load_dotenv()

class Assistant(Agent):
    # ... Your Assistant class is perfect, no changes needed inside it ...
    def __init__(self):
        super().__init__(
            instructions=AGENT_INSTRUCTION,
            llm=google.beta.realtime.RealtimeModel(
                voice="Aoede",
                temperature=0.9
            ),
            tools=[
                get_weather,
                search_web,
                send_email,
            ]
        )
        self.memory = MemorySystem()
        self.user_identity: str | None = None

    def set_user_identity(self, identity: str):
        self.user_identity = identity
        logging.info(f"User identity has been set to: {self.user_identity}")

    @function_tool()
    async def add_memory(self, context: RunContext, memory_text: str) -> str:
        if not self.user_identity:
            return "I am unable to save this memory as I cannot identify the user."
        logging.info(f"Saving memory for user: {self.user_identity}")
        return self.memory.add_memory(self.user_identity, memory_text)

    @function_tool()
    async def recall_memory(self, context: RunContext, query: str) -> str:
        if not self.user_identity:
            return "I am unable to recall memories as I cannot identify the user."
        logging.info(f"Recalling memory for user: {self.user_identity}")
        return self.memory.recall_memory(self.user_identity, query)

    @function_tool()
    async def delete_memory(self, context: RunContext, query: str) -> str:
        if not self.user_identity:
            return "I am unable to delete memories as I cannot identify the user."
        logging.info(f"Attempting to delete memory for user: {self.user_identity} with query: {query}")
        return self.memory.delete_memory(self.user_identity, query)

async def entrypoint(ctx: agents.JobContext):
    agent = Assistant()
    session = AgentSession()

    async def _publish_agent_transcript(text: str):
        # --- FIX: Create the payload object first ---
        payload = {
            "text": text,
            "is_speaking": True,
        }
        # Convert the dictionary to a JSON string
        json_payload = json.dumps(payload)
        
        logging.info(f"Agent said: '{text}', sending over data channel.")
        # Then send the correct JSON payload
        await ctx.room.local_participant.publish_data(
            payload=json_payload,
            kind=DataPacketKind.KIND_RELIABLE,
            topic="sofia-transcript",
        )

    def on_agent_said(text: str):
        asyncio.create_task(_publish_agent_transcript(text))
    
    session.on("agent_said", on_agent_said)

    # ... The rest of your entrypoint is correct ...
    await session.start(
        room=ctx.room,
        agent=agent,
        room_input_options=RoomInputOptions(
            video_enabled=True,
            audio_enabled=True,
        ),
    )
    await ctx.connect()
    stable_user_identity = "sofia_memory_user"
    agent.set_user_identity(stable_user_identity)
    await session.generate_reply(
        instructions=SESSION_INSTRUCTION
    )

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))