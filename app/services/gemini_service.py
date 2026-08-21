"""
app/services/gemini_service.py
Service wrapper around the Google Gemini API for the AI Cyber Mentor.

Responsibilities:
- Build scoped prompts based on question context and user difficulty tier.
- Call the Gemini API server-side (never expose API key to client).
- Ensure no personally identifiable information (PII) is sent or persisted.
- Provide a graceful static fallback if the API call fails or times out.
"""


def get_ai_feedback(question, user_answer, is_correct, difficulty="beginner"):
    """
    Generate contextual AI mentor feedback for a user's answer.

    Args:
        question (str): The question text.
        user_answer (str): The answer submitted by the user.
        is_correct (bool): Whether the answer was correct.
        difficulty (str): Difficulty/tier level to scope explanation depth.

    Returns:
        str: AI-generated (or fallback static) explanation text.
    """
    # TODO: implement Gemini API call with timeout + fallback
    pass


def _static_fallback_feedback(is_correct):
    """
    Returns a static explanation used when the Gemini API is unavailable.

    Args:
        is_correct (bool): Whether the answer was correct.

    Returns:
        str: A generic static feedback message.
    """
    # TODO: implement fallback copy
    pass
