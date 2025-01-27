import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-black via-red-900 to-red-800 flex items-center justify-center">
      <div className="flex flex-row items-center justify-center text-white space-x-12 px-6 w-full">
        {/* Rotating Circle Section */}
        <div className="relative flex items-center justify-center w-64 h-64 bg-neutral-300 rounded-full">
          <div className="absolute w-80 h-80 bg-transparent rounded-full border border-dotted border-gray-500 animate-spin-slow"></div>
          <p className="absolute text-black font-semibold text-xl tracking-wide">REDSTRING.</p>
        </div>

        {/* Text Section */}
        <div className="text-center">
          <h1 className="text-5xl font-light tracking-wide">RedString</h1>
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-md shadow-lg hover:bg-blue-600 hover:text-white transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
