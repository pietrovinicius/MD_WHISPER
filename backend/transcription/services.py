import os
import logging
import whisper
from django.conf import settings

logger = logging.getLogger(__name__)

class TranscriptionService:
    _model = None

    @classmethod
    def get_model(cls):
        """Lazy loads and caches the Whisper model in memory."""
        if cls._model is None:
            model_name = getattr(settings, 'WHISPER_MODEL_NAME', 'tiny')
            logger.info(f"Loading Whisper model: {model_name}")
            cls._model = whisper.load_model(model_name)
        return cls._model

    @classmethod
    def transcribe(cls, file_path: str) -> dict:
        """
        Transcribes the audio file at file_path using the local Whisper model.
        Returns a dict containing the transcribed text and language.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")
        
        try:
            model = cls.get_model()
            logger.info(f"Starting Whisper transcription for: {file_path}")
            result = model.transcribe(file_path)
            
            return {
                'text': result.get('text', '').strip(),
                'language': result.get('language', '')
            }
        except Exception as e:
            logger.exception(f"Error during Whisper transcription: {str(e)}")
            raise e
