import React, { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [maleVoice, setMaleVoice] = useState(null);
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [previewText, setPreviewText] = useState('Hello! This is a sample.');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const playVoice = (voice, text) => {
    if (!voice || !text || isSpeaking) return;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerate = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const utterances = lines.map((line) => {
      const cleanText = line.replace(/^Person [ABab] ?- ?/, '');
      const utter = new SpeechSynthesisUtterance(cleanText);
      if (line.toLowerCase().startsWith('person a') && maleVoice) {
        utter.voice = maleVoice;
      } else if (line.toLowerCase().startsWith('person b') && femaleVoice) {
        utter.voice = femaleVoice;
      }
      return utter;
    });

    if (utterances.length > 0) {
      setIsSpeaking(true);
      utterances.forEach((utt, index) => {
        utt.onend = () => {
          if (index === utterances.length - 1) {
            setIsSpeaking(false);
          }
        };
        window.speechSynthesis.speak(utt);
      });
    }
  };

  const handleDownload = async () => {
    alert("🚫 Download feature is not working currently. It will be available in a future update.");
    return;
  };

  const getFilteredVoices = (gender) => {
    const lower = gender.toLowerCase();
    return voices.filter(v =>
      v.name.toLowerCase().includes(lower) ||
      (lower === 'male' && v.name.toLowerCase().includes('daniel')) ||
      (lower === 'female' && v.name.toLowerCase().includes('samantha'))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Dual Voice Text-to-Speech App
            </h1>

            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter Conversation:
            </label>
            <textarea
              rows="10"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              placeholder="Person A - Hello!\nPerson B - Hi there!"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Copy Sample Script Button */}
            <button
              onClick={() => {
                const sample = `Person A - Hello! How are you?\nPerson B - I'm great, thanks! How about you?\nPerson A - Doing well! It's a nice day.`;
                setText(sample);
                navigator.clipboard.writeText(sample);
                alert("Sample script copied!");
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded mb-4"
            >
              Copy Sample Script
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Male Voice:</label>
                <div className="flex items-center space-x-2">
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                    onChange={(e) => setMaleVoice(voices.find(v => v.name === e.target.value))}
                  >
                    <option value="">Select Male Voice</option>
                    {getFilteredVoices('male').map(v => (
                      <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => playVoice(maleVoice, previewText)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isSpeaking}
                  >
                    Preview
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Female Voice:</label>
                <div className="flex items-center space-x-2">
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                    onChange={(e) => setFemaleVoice(voices.find(v => v.name === e.target.value))}
                  >
                    <option value="">Select Female Voice</option>
                    {getFilteredVoices('female').map(v => (
                      <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => playVoice(femaleVoice, previewText)}
                    className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isSpeaking}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleGenerate}
                className={`w-full font-bold py-3 px-6 rounded text-white ${
                  isSpeaking ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'
                }`}
                disabled={!maleVoice || !femaleVoice}
              >
                {isSpeaking ? 'Stop' : 'Generate TTS'}
              </button>

              <button
                onClick={handleDownload}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
                disabled={isSpeaking}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
