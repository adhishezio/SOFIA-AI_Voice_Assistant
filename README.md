# SOFIA: A Conversational AI Assistant

## Introduction

SOFIA (Strategic Operational Framework & Intelligence Assistant) is a sophisticated, voice-driven AI assistant inspired by the helpful and witty AI companions from popular culture, such as Iron Man's F.R.I.D.A.Y.

This project combines a powerful Python backend with a custom-built, animated frontend to create an immersive and intelligent conversational experience. The entire system is built on a modern, real-time technology stack designed for low-latency, natural interactions.

At its core, SOFIA leverages the **LiveKit Agents Framework** to manage real-time voice communication between the user and the AI.

<div style="text-align: center;">
  <img width="70%" alt="sofia_demo_ui" src="media/sofia_ui.png">
</div>

## Current Development Stage

**Status:** In Development

The project has a stable foundation for both the backend agent and the frontend interface. The system is fully functional but is continuously being improved with new skills and greater intelligence.

## Core Features

SOFIA's capabilities are divided between her backend "brain" and her frontend "face."

### Backend Agent Features

* **Persistent Memory:** SOFIA has a long-term memory system built using a RAG architecture with a ChromaDB vector store. She can learn, recall, and delete information across multiple sessions, creating a truly personalized experience.
* **Tool Use & Function Calling:** SOFIA can interact with the outside world using a set of defined tools:
    * **Web Search:** Can search the web to answer questions about current events or general knowledge.
    * **Weather Information:** Can retrieve the current weather for any city.
    * **Email Communication:** Can compose and send emails on behalf of the user.
* **Safety Protocols:** Includes a two-step confirmation before deleting any memories to prevent accidental data loss.

### Frontend Interface Features

* **Interactive & Animated UI:** A custom user interface built from scratch using React and Three.js, providing a futuristic "orb" visualization for the AI.
* **Voice-Responsive Animation:** The central orb animates and "pulses" in real-time based on the voice activity of both the user and SOFIA.
* **Particle System:** Features a dynamic starfield background with a repulsion effect, where the stars are "pushed" away by SOFIA's voice energy.
* **Retractable Chat Panel:** A functional chat button toggles a semi-transparent sidebar displaying the conversation history.
* **Custom Controls:** Includes custom-styled controls for managing the microphone, camera, and other session options.

## Technology Stack

### Backend
* **AI Orchestration:** [LiveKit Agents Framework](https://docs.livekit.io/agents/)
* **Language Model:** Google Gemini
* **Vector Database:** [ChromaDB](https://www.trychroma.com/)
* **Embeddings Model:** Hugging Face `all-MiniLM-L6-v2`

### Frontend
* **Framework:** React with TypeScript + Vite
* **Real-time Connection:** LiveKit Client SDK for JS
* **UI Components:** [@livekit/components-react](https://docs.livekit.io/components/react/)
* **3D Graphics:** Three.js
* **Particle Effects:** tsparticles & react-tsparticles
* **Token Server:** Node.js + Express

## Setup and Installation

This project consists of two main parts: the **Python Backend** and the **Frontend UI**. They must be set up and run separately.

### Part 1: Backend Setup (SOFIA Agent)

1.  **Navigate to the Backend Directory:**
    Open a terminal in the root project folder (e.g., `AI_Voice_Assistant`).

2.  **Create a Python Virtual Environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
    ```

3.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Backend Environment Variables:**
    Create a file named `.env` in this directory with your agent's credentials:
    ```dotenv
    # LiveKit Credentials (for the Python Agent)
    LIVEKIT_API_KEY="YOUR_LIVEKIT_API_KEY"
    LIVEKIT_API_SECRET="YOUR_LIVEKIT_API_SECRET"

    # Google AI API Key (for Gemini/LLM)
    GOOGLE_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
    ```

### Part 2: Frontend Setup (UI & Token Server)

1.  **Navigate to the Frontend Directory:**
    Open a *second, separate terminal* and navigate into the frontend folder:
    ```bash
    cd sofia-ui-v2 
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Frontend Environment Variables:**
    Create a file named `.env` inside the `sofia-ui-v2` directory. This file is used by both the UI and its token server.
    ```dotenv
    # For the React Frontend (Vite)
    VITE_LIVEKIT_URL="wss://your-project-name.livekit.cloud"

    # For the Node.js Token Server
    LIVEKIT_API_KEY="YOUR_LIVEKIT_API_KEY"
    LIVEKIT_API_SECRET="YOUR_LIVEKIT_API_SECRET"
    ```

## Running the Full Application

To run SOFIA, you must start **three processes** in **three separate terminals**.

1.  **Terminal 1 (AI Agent):**
    * Directory: `AI_Voice_Assistant`
    * Command: `python agent.py dev`

2.  **Terminal 2 (Token Server):**
    * Directory: `AI_Voice_Assistant/sofia-ui-v2`
    * Command: `node token-server.js`

3.  **Terminal 3 (Frontend UI):**
    * Directory: `AI_Voice_Assistant/sofia-ui-v2`
    * Command: `npm run dev`

Once all three are running, open the `localhost` URL provided by the frontend terminal (usually `http://localhost:5173`) in your browser to interact with SOFIA.

## Future Development

The vision for SOFIA is to evolve her into a truly indispensable assistant. The planned roadmap includes:

* **Reminders, Notes, and Calendar Management:** Integrating with local storage and calendar APIs.
* **Advanced Animations:** Using a vertex shader to handle the orb animation for maximum performance.
* **Proactive Assistance:** Enabling SOFIA to initiate conversations based on contextual cues.
* **Emotional Intelligence:** Analyzing the user's tone of voice to have more empathetic interactions.