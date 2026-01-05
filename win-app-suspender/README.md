# Win App Suspender (Python + GUI)

Pequeno utilitário para **Windows** com interface gráfica (Tkinter) que permite:

- listar processos em execução
- filtrar por nome
- **Suspender** (pausar) e **Retomar** (continuar) um processo
- opcionalmente **abrir um .exe e suspender** após alguns segundos

> Aviso: suspender processos pode causar travamentos, perda de dados (ex.: navegador, editor) ou comportamento inesperado. Use com cuidado.

## Requisitos

- Windows 10/11
- Python 3.10+ (recomendado)

## Instalação

```bash
cd win-app-suspender
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Executar

```bash
python main.py
```

Se “Suspender/Retomar” falhar com erro de permissão, execute o Python **como Administrador**.

## Gerar executável (opcional)

```bash
pip install pyinstaller
pyinstaller --onefile --windowed --name "WinAppSuspender" main.py
```

O executável ficará em `dist/WinAppSuspender.exe`.

## Como funciona (resumo)

O app usa `psutil` para listar processos e chama as APIs do Windows:

- `OpenProcess` (para obter o handle do processo)
- `NtSuspendProcess` / `NtResumeProcess` (para suspender/retomar)

