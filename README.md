# SOFIA: A Conversational AI Assistant

## Introduction

SOFIA (Strategic Operational Framework & Intelligence Assistant) is a sophisticated, voice-driven AI assistant inspired by the helpful and witty AI companions from popular culture, such as Iron Man's F.R.I.D.A.Y. This project is built on a modern, real-time technology stack designed to deliver low-latency, natural, and intelligent conversations.

At its core, SOFIA leverages the **LiveKit Agents Framework** to manage real-time voice and video communication, ensuring that interactions are as fluid and seamless as a natural human conversation.

This repository represents the ongoing development of SOFIA, with a focus on building a robust foundation before expanding to more advanced capabilities.

## Current Development Stage

**Status:** In Development

This project is actively being developed. The foundational features are now stable, but the system is continuously being improved with new skills and greater intelligence.

## Core Features Implemented

SOFIA is currently equipped with a powerful set of foundational features that allow for intelligent and persistent interactions:

* **Real-time Audio/Video Conversation:** Built on Google's Gemini models and LiveKit's WebRTC stack, SOFIA can engage in natural, low-latency dialogue over a live video call, allowing for face-to-face interaction.
* **Persistent Memory (User Profiling):** SOFIA has a long-term memory system built using a RAG (Retrieval-Augmented Generation) architecture with a ChromaDB vector store. She can learn, recall, and even "forget" information about the user across multiple sessions, creating a truly personalized experience.
* **Tool Use & Function Calling:** SOFIA can interact with the outside world by using a set of defined tools. The current toolset includes:
    * **Web Search:** Can search the web using DuckDuckGo to answer questions about current events or general knowledge.
    * **Weather Information:** Can retrieve the current weather for any specified city.
    * **Email Communication:** Can compose and send emails on behalf of the user.
* **Deletion with Confirmation:** To ensure data safety, SOFIA follows a strict two-step confirmation protocol before deleting any information from her memory banks.

## Technology Stack

* **Real-time Communication:** [LiveKit](https://livekit.io/)
* **AI Orchestration:** [LiveKit Agents Framework](https://docs.livekit.io/agents/)
* **Language Model:** Google Gemini (via `langchain-google-genai`)
* **Vector Database:** [ChromaDB](https://www.trychroma.com/) (via `langchain-chroma`)
* **Embeddings Model:** Hugging Face `all-MiniLM-L6-v2` (via `langchain-huggingface`)
* **Environment Management:** Python `dotenv`

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/adhishezio/AI_Voice_Assistant.git
    cd AI_Voice_Assistant
    ```

2.  **Create a Virtual Environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate 
    ```

3.  **Install Dependencies:**
    A `requirements.txt` file is provided. Install all necessary packages using pip:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the project directory. This file must contain your credentials for the services SOFIA uses.

    ```dotenv
    # LiveKit Credentials
    LIVEKIT_API_KEY="YOUR_LIVEKIT_API_KEY"
    LIVEKIT_API_SECRET="YOUR_LIVEKIT_API_SECRET"

    # Google AI API Key (for Gemini/LLM)
    GOOGLE_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

    # Gmail Credentials (for sending emails)
    GMAIL_USER="your-email@gmail.com"
    GMAIL_APP_PASSWORD="your-gmail-app-password" # Use a Google App Password
    ```

5.  **Run the Agent:**
    Launch the agent from your terminal:
    ```bash
    python agent.py console
    ```

## Future Development

The vision for SOFIA is to evolve her into a truly indispensable assistant. The planned roadmap includes the integration of several advanced features:


<img width="60%" alt="sofia_demo" src="media\sofia_test1.gif">

**Here is a short demonstration of SOFIA in action. (Note: This is still in development.)**


* **Reminders, Notes, and Calendar Management:**
    * Allowing users to set reminders that trigger at a specific time.
    * Saving and retrieving notes locally.
    * Integrating with Google Calendar to manage events and schedules through voice commands.
* **Computer Vision:**
    * Implementing a multi-modal vision model (like Gemini Pro Vision) to allow SOFIA to perceive, understand, and react to the user's visual environment through the camera feed.
* **Proactive Assistance:**
    * Enabling SOFIA to initiate conversations based on context, such as the time of day or upcoming calendar events (e.g., "Sir, you have a meeting in 15 minutes. Shall I provide a summary?").
* **Emotional Intelligence:**
    * Analyzing the user's tone of voice to understand their emotional state and adapt her responses for more empathetic and appropriate interactions.
* **Smart Home Control:**
    * Integrating with smart home platforms like Home Assistant to allow for voice control of lights, thermostats, and other connected devices.