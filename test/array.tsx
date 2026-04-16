import 'css/app.css';

import Content from 'content/Content';
import { SettingsProvider } from 'context/SettingsContext';
import { createRoot } from 'react-dom/client';

const data = {
  total: 5,
  page: 1,
  per_page: 5,
  data: [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin',
      active: true,
      score: 98.4,
      tags: ['typescript', 'react', 'node'],
      address: { city: 'Copenhagen', country: 'DK' },
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@example.com',
      role: 'editor',
      active: true,
      score: 72.1,
      tags: ['python', 'django'],
      address: { city: 'Berlin', country: 'DE' },
    },
    {
      id: 3,
      name: 'Carol',
      email: 'carol@example.com',
      role: 'viewer',
      active: false,
      score: 55.0,
      tags: [],
      address: { city: 'Amsterdam', country: 'NL' },
    },
    {
      id: 4,
      name: 'Dave',
      email: 'dave@example.com',
      role: 'editor',
      active: true,
      score: 88.9,
      tags: ['go', 'kubernetes', 'docker'],
      address: { city: 'Stockholm', country: 'SE' },
    },
    {
      id: 5,
      name: 'Eve',
      email: 'eve@example.com',
      role: 'admin',
      active: null,
      score: 0,
      tags: ['rust', 'wasm'],
      address: { city: 'Oslo', country: 'NO' },
    },
  ],
};

createRoot(document.getElementById('root')!).render(
  <SettingsProvider>
    <Content data={data} />
  </SettingsProvider>,
);
