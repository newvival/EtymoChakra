# EtymoChakra

🎵 **Transform your voice into melodic melodies**

EtymoChakra is a web-based sound recording application that captures audio input and transforms it into beautiful melodic compositions using pitch detection and musical scale theory.

## Features

- **Real-time Audio Recording**: Record your voice, humming, or any sound through your microphone
- **Live Waveform Visualization**: See your audio input visualized in real-time
- **Pitch Detection**: Advanced autocorrelation algorithm to detect fundamental frequencies
- **Melody Generation**: Automatically converts your recording into a musical melody
- **Multiple Musical Scales**: Choose from Major, Minor, Pentatonic, or Blues scales
- **Adjustable Tempo**: Control the playback speed (60-180 BPM)
- **Visual Melody Display**: See your generated melody as colorful note bars
- **Web Audio API Playback**: High-quality synthesis and playback

## How It Works

1. **Record**: Click "Start Recording" and sing, hum, or make sounds into your microphone
2. **Stop**: Click "Stop Recording" when you're done
3. **Generate**: Click "Generate Melody" to analyze your recording and create a melody
4. **Customize**: Select a musical scale and adjust the tempo
5. **Play**: Click "Play Melody" to hear your transformed composition!

## Technology Stack

- **HTML5**: Structure and canvas elements for visualization
- **CSS3**: Modern gradient styling and responsive design
- **JavaScript**: Core application logic
- **Web Audio API**: Audio recording, analysis, and synthesis
- **MediaRecorder API**: Capturing microphone input

## Algorithm Details

### Pitch Detection
Uses autocorrelation method to detect the fundamental frequency of sound waves:
- Analyzes audio in 4096-sample chunks
- Applies autocorrelation to find periodic patterns
- Converts frequencies to MIDI note numbers
- Filters out low-energy signals

### Melody Generation
Transforms pitch contour into musical melody:
- Groups consecutive similar pitches
- Snaps notes to selected musical scale
- Simplifies to 8-16 note melody
- Normalizes note durations

### Scale Quantization
Maps detected pitches to musical scales:
- **Major**: Happy, bright sound (C-D-E-F-G-A-B)
- **Minor**: Melancholic, emotional sound (C-D-Eb-F-G-Ab-Bb)
- **Pentatonic**: Asian-inspired, versatile (C-D-E-G-A)
- **Blues**: Bluesy, soulful sound (C-Eb-F-Gb-G-Bb)

## Usage

Simply open `index.html` in a modern web browser. No server or build process required!

**Note**: The application requires microphone access. Your browser will request permission when you start recording.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 11+)

Requires browsers with Web Audio API and MediaRecorder API support.

## License

MIT License - Feel free to use and modify!

---

Made with ♪ by EtymoChakra
