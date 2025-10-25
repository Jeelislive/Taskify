'use client';

import { useState } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  const handleClearTranscription = () => {
    setTranscription('');
  };

  const handleConfirmTranscription = () => {
    console.log('Processing transcription:', transcription);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Baaz Task Manager
          </h1>
          <p className="text-xl text-gray-600">
            Speak your tasks, let AI organize them
          </p>
        </header>

        <div className="flex flex-col items-center gap-8">
          <AnimatePresence mode="wait">
            {error && (
              <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </AnimatePresence>

          {!transcription ? (
            <VoiceRecorder
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleError}
            />
          ) : (
            <TranscriptionDisplay
              text={transcription}
              onClear={handleClearTranscription}
              onConfirm={handleConfirmTranscription}
            />
          )}
        </div>
      </div>
    </main>
  );
}

