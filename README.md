# Meeting Transcription AI

AI-powered real-time meeting transcription and summarization platform with multi-language support.

## Project Vision

An intelligent system that automatically transcribes meetings, identifies speakers, extracts action items, and generates comprehensive summaries - making meetings more productive and accessible.

## Planned Features

- Real-time audio transcription
- Speaker identification (diarization)
- Multi-language support (English, Sinhala, Tamil)
- Automatic meeting summarization
- Action items extraction
- Searchable meeting history
- Meeting analytics dashboard
- Calendar integration

## 🛠️ Tech Stack

### Backend
- Python 3.13
- FastAPI
- OpenAI Whisper API
- PostgreSQL
- SQLAlchemy

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React

### AI/ML
- OpenAI GPT-4 (Summarization)
- Whisper (Transcription)
- Pyannote.audio (Speaker Diarization)

## Features (Completed)

- ✅ Audio file upload with drag & drop
- ✅ AI-powered transcription using AssemblyAI
- ✅ Multi-format support (MP3, WAV, M4A, MP4)
- ✅ Language detection
- ✅ Premium dark theme UI with animations
- ✅ Real-time transcription results

## 📸 Screenshots

### Upload Interface
![Upload Interface](screenshots/mp3ToTextUI.png)

### Drag & Drop
![Drag and Drop](screenshots/mp3ToTextDragAndDrop.png)

### Transcription Results
![Transcription Output](screenshots/mp3ToTextOutput.png)

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- AssemblyAI API Key (free tier available)

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file and add your API key
echo "ASSEMBLYAI_API_KEY=your-api-key-here" > .env

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to use the application!

## Roadmap

### Coming Soon
- AI-powered meeting summarization
- Action items extraction
- Speaker diarization
- Save meeting history
- Analytics dashboard
- Sinhala & Tamil language support (with OpenAI Whisper)

## Development Status

🏗️ **MVP Complete** - Audio transcription feature fully working!


## Author

**Karunarathne S.L.D.C**

Building AI solutions with passion 

---

⭐ Star this repo if you find it useful!