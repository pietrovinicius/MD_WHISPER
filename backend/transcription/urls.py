from django.urls import path
from transcription.views import TranscribeAudioView

urlpatterns = [
    path('transcribe/', TranscribeAudioView.as_view(), name='transcribe-audio'),
]
