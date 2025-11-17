import React from 'react';
import { ChakraTheme } from '../types';

interface ResultsDisplayProps {
    result: string;
    theme: ChakraTheme;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, theme }) => {

    const renderMarkdown = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            if (line.startsWith('### ')) {
                return (
                    <h3 key={index} className={`text-2xl font-bold mt-6 mb-3 text-${theme.tw}-400 drop-shadow-[0_0_8px_var(--glow-color)]`}>
                        {line.substring(4)}
                    </h3>
                );
            }
            if (line.startsWith('* ')) {
                const boldRegex = /\*\*(.*?)\*\*/g;
                const parts = line.substring(2).split(boldRegex);

                return (
                    <li key={index} className={`pl-6 my-2 text-slate-300`}>
                        {parts.map((part, i) =>
                            i % 2 === 1 ? <strong key={i} className="font-bold text-slate-100">{part}</strong> : part
                        )}
                    </li>
                );
            }
            if (line.trim() === '') {
                return null;
            }
            return <p key={index} className={`my-2 text-slate-300 leading-relaxed`}>{line}</p>;
        });
    };

    return (
        <div
            className={`w-full max-w-3xl mx-auto p-6 sm:p-8 bg-slate-900/50 border border-slate-700 rounded-xl shadow-2xl transition-all duration-500 shadow-[0_0_40px_-10px_var(--glow-color)]`}
            style={{'--glow-color': theme.hex} as React.CSSProperties}
        >
            <div className="prose prose-invert max-w-none">
                {renderMarkdown(result)}
            </div>
        </div>
    );
};

export default ResultsDisplay;
