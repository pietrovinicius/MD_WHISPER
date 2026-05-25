import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestTranscriptionView:
    
    def test_transcribe_endpoint_not_allowed_methods(self, api_client):
        """Verify GET request to transcription endpoint is not allowed."""
        url = reverse('transcribe-audio')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_transcribe_missing_file(self, api_client):
        """Verify sending a request without a file returns 400 Bad Request."""
        url = reverse('transcribe-audio')
        response = api_client.post(url, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
        assert response.data['error'] == 'No audio file provided.'

    def test_transcribe_invalid_file_format(self, api_client):
        """Verify sending a non-audio file format returns 400 Bad Request."""
        url = reverse('transcribe-audio')
        text_file = SimpleUploadedFile("test.txt", b"This is a text file", content_type="text/plain")
        response = api_client.post(url, {'file': text_file})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
        assert 'Unsupported file format' in response.data['error']

    @patch('transcription.services.TranscriptionService.transcribe')
    def test_transcribe_success(self, mock_transcribe, api_client):
        """Verify sending a valid audio file returns the transcribed text."""
        # Mocking the service layer transcription
        mock_transcribe.return_value = {
            'text': "Olá, esta é uma consulta médica simulada.",
            'language': "pt"
        }
        
        url = reverse('transcribe-audio')
        audio_file = SimpleUploadedFile("audio.webm", b"fake-audio-content-webm", content_type="audio/webm")
        response = api_client.post(url, {'file': audio_file})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['text'] == "Olá, esta é uma consulta médica simulada."
        assert response.data['language'] == "pt"
        
        # Verify that the service was called
        mock_transcribe.assert_called_once()
