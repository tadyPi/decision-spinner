import React, { useState, useEffect } from 'react';
import { ChevronsRight, X, Trash2 } from 'lucide-react';

// A color palette for the spinner segments.
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA',
  '#F0B86E', '#F47A60', '#8A6F9E', '#3D405B', '#E07A5F'
];

// Helper function to get a color for a segment
const getColor = (index) => COLORS[index % COLORS.length];

// Helper functions for localStorage
const STORAGE_KEY = 'decision-spinner-options';

const loadOptionsFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Failed to load options from localStorage:', error);
  }
  return [];
};

const saveOptionsToStorage = (options) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch (error) {
    console.warn('Failed to save options to localStorage:', error);
  }
};
// Main App Component
export default function App() {
  // State for the list of options
  const [options, setOptions] = useState(loadOptionsFromStorage);
  // State for the new option input field
  const [newOption, setNewOption] = useState('');
  // State to control the spinning animation
  const [isSpinning, setIsSpinning] = useState(false);
  // State to store the final rotation of the wheel
  const [rotation, setRotation] = useState(0);
  // State to store the winning result
  const [result, setResult] = useState(null);

  // Save options to localStorage whenever options change
  useEffect(() => {
    saveOptionsToStorage(options);
  }, [options]);

  // Calculate the angle for each segment of the wheel
  const segmentAngle = 360 / (options.length > 0 ? options.length : 1);

  // Function to handle adding a new option
  const handleAddOption = (e) => {
    e.preventDefault();
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  // Function to remove an option
  const handleRemoveOption = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  // Function to clear all options
  const handleClearAll = () => {
    setOptions([]);
    setResult(null);
  };
  // Function to handle the spin
  const handleSpin = () => {
    if (options.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const randomOptionIndex = Math.floor(Math.random() * options.length);
    
    // Calculate the angle for the middle of the winning segment
    const winningSegmentMiddleAngle = (randomOptionIndex * segmentAngle) + (segmentAngle / 2);
    
    // The final resting position should align the middle of the winning segment with the top pointer.
    const baseRotation = 360 - winningSegmentMiddleAngle;
    
    // Add multiple full rotations to the current rotation.
    const newRotation = (rotation - (rotation % 360)) + (8 * 360) + baseRotation;

    setRotation(newRotation);

    // Wait for the spin animation to finish
    setTimeout(() => {
      setIsSpinning(false);
      setResult(options[randomOptionIndex]);
    }, 5000); // This duration must match the CSS transition duration
  };
  
  // Create the conic-gradient background for the spinner wheel
  const wheelBackground = options.length > 1 
    ? `conic-gradient(from 0deg, ${options.map((_, i) => `${getColor(i)} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ')})`
    : 'conic-gradient(#eee 0deg 360deg)';


  return (
    <div className="bg-gray-900 text-white min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Decision Spinner</h1>
        <p className="text-gray-400 mt-2">Add your options and let fate decide!</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start flex-1">
        {/* Options Panel */}
        <div className="w-full bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700 md:order-1 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-cyan-400">Options</h2>
            {options.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
                title="Clear all options"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
          <form onSubmit={handleAddOption} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add an option..."
              className="flex-grow bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 rounded-md px-4 py-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!newOption.trim()}>
              Add
            </button>
          </form>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {options.map((option, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded-md animate-fade-in">
                <span className="truncate">{option}</span>
                <button onClick={() => handleRemoveOption(index)} className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full">
                  <X size={18} />
                </button>
              </li>
            ))}
             {options.length === 0 && <p className="text-gray-500 text-center py-4">Add some options to get started!</p>}
          </ul>
        </div>

        {/* Spinner Panel */}
        <div className="flex flex-col items-center justify-center space-y-6 md:order-2 h-fit">
          <div className="relative w-full max-w-sm aspect-square mx-auto">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 z-20" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }}>
               <ChevronsRight size={48} className="text-white rotate-90" />
            </div>
            
            {/* Spinner Wheel Container */}
            <div className="w-full h-full relative">
                {/* Spinner Wheel Background */}
                <div
                  className="w-full h-full rounded-full border-8 border-gray-700/50 shadow-2xl overflow-hidden transition-transform duration-[5000ms] ease-out"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    background: wheelBackground
                  }}
                />

                {/* Labels Overlay - Rotates with the wheel */}
                <div
                  className="absolute top-0 left-0 w-full h-full z-10 transition-transform duration-[5000ms] ease-out"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    pointerEvents: 'none'
                  }}
                >
                  {options.length > 0 && options.map((option, i) => {
                    const angle = i * segmentAngle + (segmentAngle / 2);
                    return (
                      <div
                        key={i}
                        className="absolute top-0 left-0 w-full h-full flex justify-center items-start"
                        style={{ transform: `rotate(${angle}deg)` }}
                      >
                        <span
                          className="pt-[15%] text-xs sm:text-sm font-bold text-white"
                          style={{
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                          }}
                        >
                          {option.length > 12 ? option.substring(0, 12) + '...' : option}
                        </span>
                      </div>
                    );
                  })}
                </div>
            </div>
          </div>
          <button
            onClick={handleSpin}
            disabled={isSpinning || options.length < 2}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 sm:px-12 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isSpinning ? 'Spinning...' : 'Spin!'}
          </button>
        </div>
      </div>
      
      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl text-center shadow-2xl border border-gray-700 max-w-sm mx-4">
            <h3 className="text-lg text-gray-400">The winner is...</h3>
            <p className="text-4xl md:text-5xl font-bold text-cyan-400 my-4 break-words">{result}</p>
            <button onClick={() => setResult(null)} className="mt-6 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md font-semibold transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}