# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo. O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e este projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2026-05-25

### Adicionado
- **Configuração Inicial do Projeto**: Inicialização do backend Django e estrutura do app `transcription`.
- **Serviço de Transcrição Whisper Local**: Implementação de `TranscriptionService` em `services.py` que carrega de forma cached e preguiçosa o modelo Whisper local (tamanho `tiny` por padrão) para transcrever os áudios.
- **Endpoint de Transcrição REST (`/api/transcribe/`)**: Implementação de `TranscribeAudioView` em `views.py` com suporte para multipart upload, validação estrita de formatos de áudio (`.webm`, `.wav`, `.mp3`, `.ogg`, `.m4a`, `.mp4`), e tratamento seguro de arquivos de áudio temporários.
- **Frontend Single-Page**: Design limpo e responsivo de consultório médico focado no padrão Single Column e com foco total em acessibilidade.
  - Micro-animações e animação pulsar indicando gravação em andamento.
  - Temporizador dinâmico de gravação.
  - Integração com `MediaRecorder` API para captura de microfone.
  - Envio de áudio via Fetch POST multipart.
  - Função de cópia com um clique para prontuário eletrônico.
- **Suíte de Testes TDD**:
  - Testes de endpoints (`test_views.py`) cobrindo requisições inválidas, formatos não suportados, arquivos ausentes e sucesso na transcrição.
  - Testes do serviço (`test_services.py`) cobrindo arquivos inexistentes e verificação de chamada da API Whisper.
- **Documentação & Ferramentas**:
  - Script de verificação automatizada ponta a ponta (`verify_transcription.py`).
  - Guia de inicialização rápida `Anotacoes.txt` cobrindo Windows e macOS.
  - Arquivo `README.md` detalhado.
