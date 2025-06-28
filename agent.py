from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    noise_cancellation,
    google)
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION
from features import get_weather, search_web, send_email

# load environment variables from .env file which 
# contains LiveKit and Google API credentials
load_dotenv() 

# Define the agent class with specific instructions
class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTION,
                         llm=google.beta.realtime.RealtimeModel(
                        voice="Aoede",
                        temperature=0.8
                         ),
                            tools=[
                                get_weather,
                                search_web,
                                send_email
                            ]
        )

# entrypoint function for the agent session
async def entrypoint(ctx: agents.JobContext):
    session = AgentSession()

    # initialize the session with the agent and room input options
    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation
            # - If self-hosting, omit this parameter
            # - For telephony applications, use `BVCTelephony` for best results
            video_enabled=True,
            audio_enabled=True,
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    
    # connect to the LiveKit room
    await ctx.connect()

    await session.generate_reply(
        instructions=SESSION_INSTRUCTION
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))