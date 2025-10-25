export class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    }
  }

  isAvailable(): boolean {
    return this.isSupported;
  }

  startRecognition(
    onResult: (text: string) => void,
    onError: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return;
    }

    let finalTranscript = '';

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      if (finalTranscript.trim()) {
        onResult(finalTranscript.trim());
      } else {
        onError('No speech detected');
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onError('Failed to start speech recognition');
    }
  }

  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

