# GEMINI.md

Guia operacional para a Inteligência Artificial Gemini neste repositório. Este arquivo serve de referência obrigatória para toda e qualquer solicitação de desenvolvimento, manutenção ou refatoração feita neste projeto.

---

## 1) Missão do Projeto

Desenvolvimento e evolução de uma aplicação de **Assistente de Transcrição Médica** e sistemas integrados.
- O foco é a privacidade, segurança de dados e conformidade médica, processando dados sensíveis de maneira robusta.
- A arquitetura consiste em um backend Django robusto servindo uma API REST e processamento local com Whisper, e um frontend moderno baseado em padrões estritos de acessibilidade e usabilidade (UI/UX).

---

## 2) Stack e Arquitetura do Projeto

- **Backend**: Python 3.12+, Django 5.x, Django REST Framework (DRF)
- **Frontend**: HTML5 Semântico, CSS Vanilla (Custom Properties) e Vanilla JavaScript (MediaRecorder API, Fetch API).
- **Processamento de Áudio & IA**: OpenAI Whisper executando localmente.
- **Ambiente de Testes**: Pytest e Pytest-Django.

---

## 3) Regra de Navegação do Código (OBRIGATÓRIA)

Antes de analisar código-fonte ou efetuar buscas:
1. Sempre verifique e leia os arquivos de documentação relevantes (`Anotacoes.txt`, `README.md`, `CHANGELOG.md`).
2. Entenda a arquitetura modular (`backend/` para API/services e `frontend/` para arquivos estáticos).

---

## 4) Regras de Banco de Dados

- Operações de leitura (`SELECT`) são seguras e permitidas.
- Operações de escrita (`INSERT` / `UPDATE`) devem ser feitas de forma explícita e controlada.
- Operações de remoção (`DELETE`) de dados históricos ou sensíveis de produção são estritamente proibidas.

---

## 5) Padrões de Implementação

### Frontend
- **Vanilla JS**: Uso obrigatório de JavaScript Vanilla ES6+ (sem frameworks pesados ou jQuery).
- **Boas práticas**: Usar `const` por padrão; `let` apenas quando necessário; nunca `var`.
- **Manipulação de DOM**: Otimizar a manipulação do DOM (ex: uso de classes CSS, evitar reflows desnecessários).
- **Acessibilidade & UI/UX**:
  - Alvos de clique com tamanho mínimo de 44x44px.
  - Estados de foco claros e visíveis para navegação por teclado.
  - Sem uso de emojis como ícones primários (utilizar caminhos SVG limpos).
  - Transições e micro-animações fluidas (150-250ms).

### Backend (Python/Django)
- **Type Hints**: Obrigatório o uso de type hints em todas as novas funções e métodos.
- **Manipulação de Arquivos**: Usar `pathlib.Path` para manipulação de caminhos e arquivos.
- **Service Layer**: Separar regras de negócio da camada de visualização (views) utilizando classes de serviços dedicadas.
- **Manipulação Temporária**: Garantir que arquivos temporários de áudio sejam excluídos imediatamente após a transcrição no bloco `finally`.

---

## 6) TDD (Lei de Ferro)

Toda nova feature, correção de bug ou refatoração de comportamento deve seguir estritamente o ciclo TDD:
1. **RED**: Criar um teste unitário ou de integração que falha pelo motivo correto.
2. **GREEN**: Implementar a menor quantidade de código possível para passar no teste.
3. **REFACTOR**: Limpar o código mantendo os testes em verde.

### Sinais de alerta (Não permitidos):
- Produzir código de produção antes do teste correspondente.
- Teste passar sem ter falhado anteriormente.
- Postergar a escrita de testes.

---

## 7) Comandos Operacionais Úteis

### macOS / Linux
```bash
# Criar ambiente virtual
uv venv backend/.venv

# Instalar dependências
uv pip install -r backend/requirements.txt --python backend/.venv/bin/python

# Executar migrações
backend/.venv/bin/python backend/manage.py migrate

# Rodar testes
backend/.venv/bin/pytest backend

# Rodar servidor
backend/.venv/bin/python backend/manage.py runserver
```

### Windows
```cmd
:: Criar ambiente virtual
uv venv backend\.venv

:: Instalar dependências
uv pip install -r backend\requirements.txt --python backend\.venv\Scripts\python

:: Executar migrações
backend\.venv\Scripts\python backend\manage.py migrate

:: Rodar testes
backend\.venv\Scripts\pytest backend

:: Rodar servidor
backend\.venv\Scripts\python backend\manage.py runserver
```

---

## 8) Políticas de Mudança & Versionamento

- **Registro de Alterações**: Registre todas as mudanças de forma concisa, versionada e datada no arquivo `CHANGELOG.md` na raiz do projeto.
- **Mensagens de Commit**: Utilizar o padrão Conventional Commits em português (`feat`, `fix`, `style`, `refactor`, `test`, `docs`, `chore`).
  *Exemplo:*
  `git commit -m "feat(views): adiciona validação de mimetype no upload de áudio"`
- **Uso do Script de Push**: Usar preferencialmente o script de commit inteligente para registrar as entregas:
  ```bash
  bash Skills/git-pushing/scripts/smart_commit.sh "tipo: descricao da mudanca"
  ```

---

## 9) Estilo de Resposta do Agente

- Responda de forma direta, objetiva e focada na solução do problema.
- Evite explicações básicas ou redundantes.
- Foque em código limpo, modular e devidamente tipado.
- Sempre crie links markdown clicáveis com o esquema `file://` para arquivos modificados ou criados.
