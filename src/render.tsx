import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStyle } from './styles/global';
import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import App from './pages/App';

export default function render() {
  const container = document.querySelector('#root');

  if (!container) return;

  const root = createRoot(container);
  root.render(
    // <StrictMode>
    <Suspense fallback={null}>
      <GlobalStyle />
      <App />
      <ToastContainer theme="dark" position="bottom-center" autoClose={3000} />
    </Suspense>
    // </StrictMode>
  );

  postMessage({ payload: 'removeLoading' }, '*');
}
