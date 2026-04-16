import App from 'App';
import { SettingsProvider } from 'context/SettingsContext';
import 'css/app.css';
import { createRoot } from 'react-dom/client';

const data = {
  id: 42,
  name: 'Alice Wonderland',
  email: 'alice@example.com',
  age: 30,
  score: 99.5,
  active: true,
  verified: false,
  tag: null,
  role: 'admin',
  createdAt: '2024-01-15T08:30:00Z',
};

createRoot(document.getElementById('root')!).render(
  <SettingsProvider>
    <App data={data} />
  </SettingsProvider>,
);
