# Medical Whisper - Assistente de Transcrição Médica (MVP)

O **Medical Whisper** é um assistente inteligente projetado para o ambiente de consultório médico. Ele permite que o profissional grave o áudio das consultas diretamente da página da web e obtenha a transcrição do texto em segundos utilizando o modelo de inteligência artificial **OpenAI Whisper** rodando 100% localmente. Isso garante total privacidade aos dados do paciente, sem necessidade de enviar os áudios para serviços em nuvem.

---

## 🚀 Stack Tecnológico

- **Frontend**: HTML5 Semântico, Vanilla CSS3 (Custom Properties e design responsivo/acessível) e Vanilla JavaScript (MediaRecorder API e Fetch API).
- **Backend**: Python 3, Django 5.x e Django REST Framework (DRF) com suporte a CORS (`django-cors-headers`).
- **Processamento de Áudio & IA**: OpenAI Whisper (executando localmente no CPU do computador) e FFmpeg.
- **Gerenciamento de Pacotes**: `uv` (Fast Python package manager) ou `pip`.
- **Ambiente de Testes**: Pytest e Pytest-Django (implementado sob a abordagem TDD).

---

## 🛠️ Arquitetura do Projeto

O projeto é separado de forma modular em duas pastas principais:

- **`backend/`**: Contém a API em Django REST Framework.
  - `config/`: Configurações globais do Django (settings, URLs e CORS).
  - `transcription/`: O aplicativo de transcrição contendo a lógica de views e o service layer.
    - `services.py`: `TranscriptionService` responsável por carregar o modelo Whisper em memória (modo preguiçoso/cached) e realizar a transcrição.
    - `views.py`: `TranscribeAudioView` que recebe o upload de áudio, valida formatos, manipula arquivos temporários e chama o serviço Whisper.
    - `tests/`: Testes automatizados de integração e de unidade desenvolvidos em TDD.
- **`frontend/`**: Contém a interface do usuário.
  - `index.html`: Layout semântico com foco no padrão de conversão Single Column.
  - `style.css`: Estilo visual completo com foco em acessibilidade e micro-interações.
  - `app.js`: Responsável por capturar o microfone, controlar o gravador de áudio, temporizador e realizar a requisição POST assíncrona.

---

## 📦 Como Instalar e Rodar o Projeto

Consulte o arquivo [Anotacoes.txt](file:///Users/pietrodapenhadelima/Projetos/MD_WHISPER/Anotacoes.txt) na raiz do projeto para o passo a passo completo de instalação tanto para **Windows** quanto para **macOS**. 

### Passos rápidos (macOS):
```bash
# Criar e instalar dependências do backend
uv venv backend/.venv
uv pip install -r backend/requirements.txt --python backend/.venv/bin/python

# Executar testes unitários
backend/.venv/bin/pytest backend

# Iniciar servidor Django
backend/.venv/bin/python backend/manage.py runserver
```

---

## ♿ Design System & Acessibilidade (UI/UX)

Seguindo as diretrizes da especificação `ui-ux-pro-max`, a interface web conta com:
- **Padrão de Visualização**: Foco em uma coluna única simplificada, removendo elementos de navegação excessivos para concentrar a atenção do médico na ação de gravar e ler.
- **Acessibilidade**:
  - Alvos de clique de no mínimo 44x44px.
  - Contraste de cor aprimorado (texto principal em azul clínico profundo `#164E63` sobre fundo `#ECFEFF`).
  - Anéis de foco nítidos de 3px para navegação por teclado.
  - Textos descritivos e `aria-labels` nos botões e caixas de texto.
  - Desativação de interações críticas durante o processamento.
- **Efeitos e Micro-animações**:
  - Transições suaves de 150-250ms em hover e estados ativos.
  - Indicador pulsar vermelho (`animation: pulse`) e oscilação de botão (`animation: wiggle`) enquanto a consulta está sendo gravada.
