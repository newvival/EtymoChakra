import { useState } from 'react'
import ResultsDisplay from './components/ResultsDisplay'
import { ChakraTheme } from './types'

const themes: ChakraTheme[] = [
  { tw: 'purple', hex: '#a855f7' },
  { tw: 'blue', hex: '#3b82f6' },
  { tw: 'emerald', hex: '#10b981' },
  { tw: 'rose', hex: '#f43f5e' },
  { tw: 'amber', hex: '#f59e0b' },
  { tw: 'cyan', hex: '#06b6d4' },
]

const sampleResults = [
  {
    theme: themes[0],
    content: `### Root Chakra Analysis

The **Root Chakra** (Muladhara) is the foundation of your energy system.

* **Sanskrit Name**: Muladhara
* **Location**: Base of the spine
* **Color**: Deep red
* **Element**: Earth
* **Key Qualities**: Grounding, stability, security

When balanced, you feel grounded and secure in your physical existence.`
  },
  {
    theme: themes[1],
    content: `### Throat Chakra Insights

The **Throat Chakra** (Vishuddha) governs communication and self-expression.

* **Sanskrit Name**: Vishuddha
* **Location**: Throat area
* **Color**: Bright blue
* **Element**: Ether/Space
* **Key Qualities**: Communication, truth, creativity

Express yourself authentically and speak your truth with confidence.`
  },
  {
    theme: themes[2],
    content: `### Heart Chakra Wisdom

The **Heart Chakra** (Anahata) is the center of love and compassion.

* **Sanskrit Name**: Anahata
* **Location**: Center of chest
* **Color**: Emerald green
* **Element**: Air
* **Key Qualities**: Love, compassion, connection

Open your heart to give and receive love unconditionally.`
  },
]

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextResult = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleResults.length)
  }

  const prevResult = () => {
    setCurrentIndex((prev) => (prev - 1 + sampleResults.length) % sampleResults.length)
  }

  const currentResult = sampleResults[currentIndex]

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          EtymoChakra
        </h1>
        <p className="text-slate-400 text-lg">
          Themed Results Display Component Demo
        </p>
      </div>

      <ResultsDisplay
        result={currentResult.content}
        theme={currentResult.theme}
      />

      <div className="flex gap-4 items-center">
        <button
          onClick={prevResult}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
        >
          Previous
        </button>
        <div className="text-slate-400">
          {currentIndex + 1} / {sampleResults.length}
        </div>
        <button
          onClick={nextResult}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
        >
          Next
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        {themes.map((theme, idx) => (
          <div
            key={idx}
            className="w-8 h-8 rounded-full border-2 border-slate-600"
            style={{ backgroundColor: theme.hex }}
            title={theme.tw}
          />
        ))}
      </div>
    </div>
  )
}

export default App
