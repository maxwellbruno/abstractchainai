
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use createRoot API for React 18
createRoot(document.getElementById("root")!).render(<App />);
