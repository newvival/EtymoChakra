// EtymoChakra - Sound to Melody Application

class SoundToMelody {
    constructor() {
        this.audioContext = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedAudioBuffer = null;
        this.analyser = null;
        this.isRecording = false;
        this.recordingStartTime = null;
        this.timerInterval = null;
        this.melodyNotes = [];

        // Musical scales
        this.scales = {
            major: [0, 2, 4, 5, 7, 9, 11],
            minor: [0, 2, 3, 5, 7, 8, 10],
            pentatonic: [0, 2, 4, 7, 9],
            blues: [0, 3, 5, 6, 7, 10]
        };

        this.initElements();
        this.initEventListeners();
        this.initVisualizers();
    }

    initElements() {
        this.recordBtn = document.getElementById('recordBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.playMelodyBtn = document.getElementById('playMelodyBtn');
        this.statusText = document.getElementById('statusText');
        this.timer = document.getElementById('timer');
        this.visualizer = document.getElementById('visualizer');
        this.melodyCanvas = document.getElementById('melodyCanvas');
        this.scaleSelect = document.getElementById('scaleSelect');
        this.tempoSlider = document.getElementById('tempoSlider');
        this.tempoValue = document.getElementById('tempoValue');
    }

    initEventListeners() {
        this.recordBtn.addEventListener('click', () => this.startRecording());
        this.stopBtn.addEventListener('click', () => this.stopRecording());
        this.generateBtn.addEventListener('click', () => this.generateMelody());
        this.playMelodyBtn.addEventListener('click', () => this.playMelody());
        this.tempoSlider.addEventListener('input', (e) => {
            this.tempoValue.textContent = e.target.value;
        });
    }

    initVisualizers() {
        // Set canvas sizes
        this.visualizer.width = this.visualizer.offsetWidth;
        this.visualizer.height = this.visualizer.offsetHeight;
        this.melodyCanvas.width = this.melodyCanvas.offsetWidth;
        this.melodyCanvas.height = 200;
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Initialize audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(stream);

            // Setup analyser for visualization
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            source.connect(this.analyser);

            // Setup media recorder
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                await this.processRecording(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Update UI
            this.recordBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.statusText.textContent = 'Recording...';

            // Start timer
            this.startTimer();

            // Start visualization
            this.visualize();

        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.statusText.textContent = 'Error: Could not access microphone';
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopTimer();

            // Update UI
            this.recordBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.statusText.textContent = 'Processing recording...';
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.timer.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    async processRecording(audioBlob) {
        try {
            const arrayBuffer = await audioBlob.arrayBuffer();
            this.recordedAudioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.statusText.textContent = 'Recording complete! Click "Generate Melody"';
            this.generateBtn.disabled = false;

        } catch (error) {
            console.error('Error processing recording:', error);
            this.statusText.textContent = 'Error processing recording';
        }
    }

    visualize() {
        if (!this.isRecording) return;

        const canvas = this.visualizer;
        const ctx = canvas.getContext('2d');
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!this.isRecording) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            requestAnimationFrame(draw);
            this.analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = 'rgb(20, 20, 40)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(100, 200, 255)';
            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        };

        draw();
    }

    // Pitch detection using autocorrelation
    detectPitch(buffer, sampleRate) {
        const SIZE = buffer.length;
        const MAX_SAMPLES = Math.floor(SIZE / 2);
        let best_offset = -1;
        let best_correlation = 0;
        let rms = 0;

        // Calculate RMS (volume)
        for (let i = 0; i < SIZE; i++) {
            const val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);

        // Not enough signal
        if (rms < 0.01) return -1;

        // Autocorrelation
        let lastCorrelation = 1;
        for (let offset = 1; offset < MAX_SAMPLES; offset++) {
            let correlation = 0;

            for (let i = 0; i < MAX_SAMPLES; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }

            correlation = 1 - (correlation / MAX_SAMPLES);

            if (correlation > 0.9 && correlation > lastCorrelation) {
                const foundGoodCorrelation = correlation > best_correlation;
                if (foundGoodCorrelation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            }

            lastCorrelation = correlation;
        }

        if (best_correlation > 0.01) {
            return sampleRate / best_offset;
        }
        return -1;
    }

    // Convert frequency to MIDI note number
    frequencyToMidi(frequency) {
        return Math.round(12 * Math.log2(frequency / 440) + 69);
    }

    // Convert MIDI note to frequency
    midiToFrequency(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    // Snap MIDI note to scale
    snapToScale(midiNote, scale) {
        const scaleNotes = this.scales[scale];
        const octave = Math.floor(midiNote / 12);
        const noteInOctave = midiNote % 12;

        // Find closest note in scale
        let closestNote = scaleNotes[0];
        let minDistance = Math.abs(noteInOctave - closestNote);

        for (const scaleNote of scaleNotes) {
            const distance = Math.abs(noteInOctave - scaleNote);
            if (distance < minDistance) {
                minDistance = distance;
                closestNote = scaleNote;
            }
        }

        return octave * 12 + closestNote;
    }

    generateMelody() {
        if (!this.recordedAudioBuffer) return;

        this.statusText.textContent = 'Generating melody...';

        const audioData = this.recordedAudioBuffer.getChannelData(0);
        const sampleRate = this.recordedAudioBuffer.sampleRate;
        const scale = this.scaleSelect.value;

        // Analyze audio in chunks to extract pitch contour
        const chunkSize = 4096;
        const hopSize = 2048;
        const pitches = [];

        for (let i = 0; i < audioData.length - chunkSize; i += hopSize) {
            const chunk = audioData.slice(i, i + chunkSize);
            const frequency = this.detectPitch(chunk, sampleRate);

            if (frequency > 0 && frequency < 2000) {
                const midiNote = this.frequencyToMidi(frequency);
                const snappedNote = this.snapToScale(midiNote, scale);
                pitches.push(snappedNote);
            }
        }

        // Create melody by simplifying pitch contour
        this.melodyNotes = this.simplifyToMelody(pitches, scale);

        // Visualize melody
        this.visualizeMelody(this.melodyNotes);

        this.statusText.textContent = `Melody generated with ${this.melodyNotes.length} notes!`;
        this.playMelodyBtn.disabled = false;
    }

    simplifyToMelody(pitches, scale) {
        if (pitches.length === 0) return [];

        // Group similar consecutive pitches
        const notes = [];
        let currentNote = pitches[0];
        let currentDuration = 1;

        for (let i = 1; i < pitches.length; i++) {
            if (Math.abs(pitches[i] - currentNote) <= 2) {
                currentDuration++;
            } else {
                notes.push({ midi: currentNote, duration: currentDuration });
                currentNote = pitches[i];
                currentDuration = 1;
            }
        }
        notes.push({ midi: currentNote, duration: currentDuration });

        // Limit to reasonable melody length (8-16 notes)
        const targetLength = Math.min(16, Math.max(8, notes.length));
        const simplified = [];
        const step = notes.length / targetLength;

        for (let i = 0; i < targetLength; i++) {
            const index = Math.floor(i * step);
            if (notes[index]) {
                simplified.push({
                    midi: notes[index].midi,
                    duration: 0.5 // Normalized duration
                });
            }
        }

        return simplified;
    }

    visualizeMelody(notes) {
        const canvas = this.melodyCanvas;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (notes.length === 0) return;

        const noteWidth = canvas.width / notes.length;
        const minMidi = Math.min(...notes.map(n => n.midi));
        const maxMidi = Math.max(...notes.map(n => n.midi));
        const midiRange = maxMidi - minMidi || 12;

        // Draw notes
        notes.forEach((note, i) => {
            const x = i * noteWidth;
            const normalizedHeight = (note.midi - minMidi) / midiRange;
            const y = canvas.height - (normalizedHeight * canvas.height * 0.8) - 20;
            const height = 30;

            // Draw note bar
            ctx.fillStyle = `hsl(${(i / notes.length) * 360}, 70%, 60%)`;
            ctx.fillRect(x + 2, y, noteWidth - 4, height);

            // Draw note border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 2, y, noteWidth - 4, height);
        });

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = (canvas.height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    async playMelody() {
        if (this.melodyNotes.length === 0) return;

        this.playMelodyBtn.disabled = true;
        this.statusText.textContent = 'Playing melody...';

        const tempo = parseInt(this.tempoSlider.value);
        const beatDuration = 60 / tempo; // Duration of one beat in seconds

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let currentTime = audioContext.currentTime;

        for (const note of this.melodyNotes) {
            this.playNote(audioContext, note.midi, currentTime, beatDuration * note.duration);
            currentTime += beatDuration * note.duration;
        }

        // Re-enable button after melody finishes
        setTimeout(() => {
            this.playMelodyBtn.disabled = false;
            this.statusText.textContent = 'Melody playback complete!';
        }, currentTime * 1000);
    }

    playNote(audioContext, midiNote, startTime, duration) {
        const frequency = this.midiToFrequency(midiNote);

        // Create oscillator
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);

        // Create gain for envelope
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        // Connect and play
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SoundToMelody();
});
