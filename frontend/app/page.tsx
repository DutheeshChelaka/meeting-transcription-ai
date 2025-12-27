'use client'

import { useState } from 'react'
import axios from 'axios'
import { Upload, FileAudio, Loader2, CheckCircle2, AlertCircle, Zap, Sparkles, Mic } from 'lucide-react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState('')
  const [language, setLanguage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [summary, setSummary] = useState('')
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [actionItems, setActionItems] = useState<any[]>([])
  const [decisions, setDecisions] = useState<any[]>([])
  const [summarizing, setSummarizing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setError('')
    }
  }

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError('')
    setTranscript('')
    setSummary('')
    setKeyPoints([])
    setActionItems([])
    setDecisions([])

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Step 1: Transcribe
      const transcribeResponse = await axios.post(
        'http://localhost:8000/api/transcribe',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (transcribeResponse.data.success) {
        const transcriptText = transcribeResponse.data.transcript
        setTranscript(transcriptText)
        setLanguage(transcribeResponse.data.language)
        
        // Step 2: Summarize automatically
        setSummarizing(true)
        try {
          const summarizeResponse = await axios.post(
            'http://localhost:8000/api/summarize',
            {
              transcript: transcriptText,
              quick: false
            }
          )

          if (summarizeResponse.data.success) {
            setSummary(summarizeResponse.data.summary)
            setKeyPoints(summarizeResponse.data.key_points || [])
            setActionItems(summarizeResponse.data.action_items || [])
            setDecisions(summarizeResponse.data.decisions || [])
          }
        } catch (summaryErr) {
          console.error('Summarization error:', summaryErr)
          // Don't show error - summarization is optional
        } finally {
          setSummarizing(false)
        }
      } else {
        setError(transcribeResponse.data.error || 'Transcription failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error uploading file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] animate-pulse"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 animate-slide-down">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm text-gray-400">Powered by AI</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Meeting Transcription AI
          </h1>
          <p className="text-gray-400 text-lg animate-fade-in animation-delay-300">
            Transform audio into text instantly with advanced AI technology
          </p>

          {/* Animated Mic Icon */}
          <div className="mt-8 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-xl opacity-50 animate-ping"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce-slow">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 animate-slide-up hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center animate-pulse-slow">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Upload Audio</h2>
          </div>
          
          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                {file ? (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4 animate-bounce-in shadow-lg shadow-green-500/50">
                      <FileAudio className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <p className="text-xl font-semibold text-white mb-2 animate-fade-in">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-400 animate-fade-in animation-delay-100">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 text-gray-400 animate-bounce-slow" />
                    </div>
                    <p className="text-xl font-semibold text-white mb-2">
                      Drop your audio file here
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      or click to browse
                    </p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors duration-200">MP3</span>
                      <span className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors duration-200">WAV</span>
                      <span className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors duration-200">M4A</span>
                      <span className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors duration-200">MP4</span>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start backdrop-blur-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Transcribe Button */}
          <button
            onClick={handleTranscribe}
            disabled={!file || loading}
            className="group w-full mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span className="animate-pulse">Transcribing...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Transcribe Audio
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {transcript && (
          <div className="space-y-6">
            {/* Transcript */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up hover:shadow-green-500/10 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center animate-bounce-in shadow-lg shadow-green-500/50">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Transcription</h2>
              </div>
              
              {language && (
                <div className="mb-4 animate-fade-in">
                  <span className="inline-block bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                    Language: {language.toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-300">
                <p className="text-gray-100 whitespace-pre-wrap leading-relaxed text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {transcript}
                </p>
              </div>
            </div>

            {/* AI Summary Section */}
            {summarizing && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                  <p className="text-gray-300">Generating AI summary...</p>
                </div>
              </div>
            )}

            {summary && !summarizing && (
              <>
                {/* Executive Summary */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up hover:shadow-purple-500/10 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">AI Summary</h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                    <p className="text-gray-100 leading-relaxed text-lg">
                      {summary}
                    </p>
                  </div>
                </div>

                {/* Key Points */}
                {keyPoints.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up hover:shadow-cyan-500/10 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold text-white">Key Points</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {keyPoints.map((point, index) => (
                        <div 
                          key={index}
                          className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors duration-300 flex items-start gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-cyan-300 text-sm font-semibold">{index + 1}</span>
                          </div>
                          <p className="text-gray-100 leading-relaxed flex-1">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Items */}
                {actionItems.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up hover:shadow-orange-500/10 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/50">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold text-white">Action Items</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {actionItems.map((item, index) => {
                        // Handle both string and object formats
                        const itemText = typeof item === 'string' 
                          ? item 
                          : item.task || item.item || JSON.stringify(item);
                        
                        return (
                          <div 
                            key={index}
                            className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-colors duration-300 flex items-start gap-3"
                          >
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <Zap className="w-4 h-4 text-orange-300" />
                            </div>
                            <p className="text-gray-100 leading-relaxed flex-1">{itemText}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Decisions */}
                {decisions.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up hover:shadow-green-500/10 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold text-white">Decisions Made</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {decisions.map((decision, index) => {
                        // Handle both string and object formats
                        const decisionText = typeof decision === 'string'
                          ? decision
                          : decision.decision || JSON.stringify(decision);
                        
                        return (
                          <div 
                            key={index}
                            className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-colors duration-300 flex items-start gap-3"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <CheckCircle2 className="w-4 h-4 text-green-300" />
                            </div>
                            <p className="text-gray-100 leading-relaxed flex-1">{decisionText}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animate-gradient { animation: gradient 3s ease infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}