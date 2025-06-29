import logging
import json
import os
from livekit.agents import function_tool, RunContext
from typing import Optional

PROFILES_DIR = "profiles"

os.makedirs(PROFILES_DIR, exist_ok=True)

def get_profile_path(context: RunContext) -> Optional[str]:
    participant = context.participant
    if not participant or not participant.identity:
        logging.error("Could not determine participant identity for user profile.")
        return None
    
    filename = "".join(c for c in participant.identity if c.isalnum() or c in ('-', '_')).rstrip()
    return os.path.join(PROFILES_DIR, f"user_profile_{filename}.json")

@function_tool()
async def save_user_info(
    context: RunContext,
    key: str,
    value: str,
) -> str:
    profile_path = get_profile_path(context)
    if not profile_path:
        return "Could not save user info because the user identity is not available."

    try:
        # Load existing data or create a new dictionary
        if os.path.exists(profile_path):
            with open(profile_path, 'r') as f:
                data = json.load(f)
        else:
            data = {}
        
        # Update the data and save it back to the file
        data[key.lower()] = value
        with open(profile_path, 'w') as f:
            json.dump(data, f, indent=4)
        
        logging.info(f"Saved info for user: {key}={value}")
        return f"I've noted that {key} is {value}."
        
    except Exception as e:
        logging.error(f"Error saving user info: {e}")
        return "I encountered an error trying to remember that."


@function_tool()
async def get_user_info(
    context: RunContext,
    key: str,
) -> str:
    profile_path = get_profile_path(context)
    if not profile_path:
        return "Could not retrieve user info because the user identity is not available."

    try:
        if not os.path.exists(profile_path):
            return "I don't have that information stored for you."

        with open(profile_path, 'r') as f:
            data = json.load(f)
        
        value = data.get(key.lower())
        
        if value:
            logging.info(f"Retrieved info for user: {key}={value}")
            return f"Based on my records, your {key} is {value}."
        else:
            logging.info(f"Info not found for user: {key}")
            return f"I don't have a record of your {key}."

    except Exception as e:
        logging.error(f"Error retrieving user info: {e}")
        return "I encountered an error trying to recall that information."