export class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;
  private finalTranscript: string = '';
  private isRecognizing: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;
        this.isSupported = true;
      }
    }
  }

  isAvailable(): boolean {
    return this.isSupported;
  }

  startRecognition(
    onResult: (text: string) => void,
    onError: (error: string) => void,
    onInterim?: (text: string) => void
  ): void {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return;
    }

    this.finalTranscript = '';
    this.isRecognizing = true;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + ' ';
          console.log('Final transcript:', transcript);
        } else {
          interimTranscript += transcript;
        }
      }

      // Also store interim results as backup
      if (interimTranscript && !this.finalTranscript) {
        console.log('Interim transcript:', interimTranscript);
      }

      if (onInterim) {
        const displayText = this.finalTranscript + interimTranscript;
        if (displayText) {
          onInterim(displayText.trim());
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isRecognizing = false;
      
      if (event.error === 'no-speech') {
        onError('No speech detected. Please speak clearly and try again.');
      } else if (event.error === 'audio-capture') {
        onError('Microphone not accessible. Please check permissions.');
      } else if (event.error === 'not-allowed') {
        onError('Microphone access denied. Please grant permission.');
      } else {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isRecognizing = false;
      const result = this.finalTranscript.trim();
      
      console.log('Recognition ended. Final result:', result);
      
      if (result) {
        onResult(result);
      } else {
        onError('No speech was captured. Please try speaking louder and for longer (at least 3-5 seconds). Make sure to see the blue text box appear before stopping.');
      }
    };

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isRecognizing = true;
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      this.isRecognizing = false;
      onError('Failed to start speech recognition. Please try again.');
    }
  }

  stopRecognition(): void {
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop();
    }
  }

  isCurrentlyRecognizing(): boolean {
    return this.isRecognizing;
  }
}

