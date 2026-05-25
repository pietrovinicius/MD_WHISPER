import os
import pytest
from unittest.mock import patch, MagicMock
from transcription.services import TranscriptionService

def test_transcribe_file_not_found():
    """Verify that FileNotFoundError is raised if audio file does not exist."""
    with pytest.raises(FileNotFoundError):
        TranscriptionService.transcribe("non_existent_file.wav")

@patch('transcription.services.whisper.load_model')
@patch('transcription.services.os.path.exists')
def test_transcribe_calls_whisper_correctly(mock_exists, mock_load_model):
    """Verify that Whisper transcribe is called correctly and returns expected dict."""
    # Setup mocks
    mock_exists.return_value = True
    mock_model = MagicMock()
    mock_model.transcribe.return_value = {
        'text': "Mocked transcription result",
        'language': "en"
    }
    mock_load_model.return_value = mock_model
    
    # We must reset the cached model to force loading the mocked one
    TranscriptionService._model = None
    
    result = TranscriptionService.transcribe("dummy_path.wav")
    
    # Assertions
    mock_load_model.assert_called_once_with("tiny")
    mock_model.transcribe.assert_called_once_with("dummy_path.wav")
    assert result['text'] == "Mocked transcription result"
    assert result['language'] == "en"
