import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SimpleHypatiaApp } from './SimpleHypatiaApp.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SimpleHypatiaApp />
    </ErrorBoundary>
  </StrictMode>,
);
