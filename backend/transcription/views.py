import os
import uuid
import logging
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from transcription.services import TranscriptionService

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'.webm', '.wav', '.mp3', '.ogg', '.m4a', '.mp4'}

class TranscribeAudioView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        audio_file = request.FILES.get('file')
        
        if not audio_file:
            return Response(
                {'error': 'No audio file provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate extension
        _, ext = os.path.splitext(audio_file.name.lower())
        if ext not in ALLOWED_EXTENSIONS:
            return Response(
                {'error': f'Unsupported file format. Allowed formats: {", ".join(sorted(ALLOWED_EXTENSIONS))}'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Create temp file name and path
        temp_file_name = f"{uuid.uuid4()}{ext}"
        temp_file_path = os.path.join(settings.TEMP_AUDIO_DIR, temp_file_name)
        
        # Save uploaded file chunk by chunk to temp path
        try:
            with open(temp_file_path, 'wb+') as destination:
                for chunk in audio_file.chunks():
                    destination.write(chunk)
            
            # Call service to transcribe
            transcription_result = TranscriptionService.transcribe(temp_file_path)
            return Response(transcription_result, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception(f"Error handling transcription request: {str(e)}")
            return Response(
                {'error': 'An error occurred during audio processing.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        finally:
            # Safely clean up file
            if os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except Exception as cleanup_err:
                    logger.error(f"Failed to delete temp file {temp_file_path}: {str(cleanup_err)}")
