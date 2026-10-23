"""
app/services/gemini_service.py
Service wrapper around the Google Gemini API for the AI Cyber Mentor.

Responsibilities:
- Build scoped prompts based on question context and user difficulty tier.
- Call the Gemini API server-side (never expose API key to client).
- Ensure no personally identifiable information (PII) is sent or persisted.
- Provide a graceful static fallback if the API call fails or times out.
"""

import logging

from flask import current_app

logger = logging.getLogger(__name__)


def get_ai_feedback_with_source(question, user_answer, is_correct, difficulty="beginner", static_fallback=None):
    """
    Generate contextual AI mentor feedback for a user's answer.
    Returns (feedback_text, is_ai_boolean).

    Args:
        question (str): The question text.
        user_answer (str): The answer submitted by the user.
        is_correct (bool): Whether the answer was correct.
        difficulty (str): Difficulty/tier level to scope explanation depth.
            One of "beginner", "intermediate", "advanced".
        static_fallback (str): Static explanation to use if AI is unavailable.

    Returns:
        tuple[str, bool]: (explanation_text, is_ai_generated)
    """
    api_key = current_app.config.get("GEMINI_API_KEY")

    if not api_key or api_key == "your_gemini_api_key_here":
        logger.info("Gemini API key not configured — using static fallback.")
        return _static_fallback_feedback(is_correct, static_fallback), False

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)

        # Build a scoped system prompt based on difficulty tier
        depth_instructions = {
            "beginner": (
                "Explain in very simple, non-technical language. Use analogies "
                "a non-technical person would understand. Keep it under 3 sentences. "
                "Avoid jargon."
            ),
            "intermediate": (
                "Provide a clear, moderately technical explanation. Mention relevant "
                "concepts (e.g., OWASP, social engineering tactics) but keep it "
                "accessible. 3-5 sentences."
            ),
            "advanced": (
                "Give a detailed, technical explanation suitable for a cybersecurity "
                "student. Reference specific frameworks (OWASP Top 10, MITRE ATT&CK), "
                "CVEs, or real-world attack patterns where relevant. 4-6 sentences."
            ),
        }

        depth = depth_instructions.get(difficulty, depth_instructions["beginner"])
        result_word = "correct" if is_correct else "incorrect"

        prompt = (
            f"You are the AI Cyber Mentor in a cybersecurity awareness training portal. "
            f"A user just answered a question {result_word}.\n\n"
            f"Question: {question}\n"
            f"User's answer: {user_answer}\n"
            f"Was correct: {is_correct}\n\n"
            f"Provide educational feedback. {depth}\n\n"
            f"If the answer was wrong, gently explain why and what the correct "
            f"approach is. If correct, reinforce the learning with an interesting "
            f"related fact or tip. Never include personal information or identify "
            f"the user. Respond in plain text (no markdown)."
        )

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=300,
                temperature=0.7,
            ),
            request_options={"timeout": 5},
        )

        if response and response.text:
            return response.text.strip(), True
        else:
            logger.warning("Gemini returned empty response — using fallback.")
            return _static_fallback_feedback(is_correct, static_fallback), False

    except Exception as e:
        logger.warning(f"Gemini API call failed: {e} — using static fallback.")
        return _static_fallback_feedback(is_correct, static_fallback), False


def get_ai_feedback(
    question: str,
    user_answer: str,
    is_correct: bool,
    difficulty: str = "beginner",
    static_fallback: str = None,
) -> str:
    """
    Backward-compatible wrapper returning only feedback text.
    """
    text, _ = get_ai_feedback_with_source(
        question, user_answer, is_correct, difficulty, static_fallback
    )
    return text


def _static_fallback_feedback(is_correct: bool, static_fallback: str = None) -> str:
    """
    Returns a static explanation used when the Gemini API is unavailable.
    Prioritizes question/module-specific static explanation if provided.
    """
    if static_fallback and static_fallback.strip():
        return static_fallback.strip()

    if is_correct:
        return (
            "Great job! You got this one right. Understanding these security "
            "concepts helps you stay safe online. Keep up the good work and "
            "continue practicing to strengthen your cyber awareness skills."
        )
    else:
        return (
            "That's not quite right, but don't worry — learning from mistakes "
            "is part of the process! Review the explanation carefully and try "
            "to understand why the correct answer is what it is. Cybersecurity "
            "awareness is built one lesson at a time."
        )
