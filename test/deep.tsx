import 'css/app.css';

import Content from 'content/Content';
import { createRoot } from 'react-dom/client';

const data = {
  organization: {
    id: 'org_001',
    name: 'Acme Corp',
    settings: {
      billing: {
        plan: 'enterprise',
        cycle: 'annual',
        payment: {
          method: 'card',
          details: {
            last4: '4242',
            brand: 'visa',
            expiry: {
              month: 12,
              year: 2026,
            },
          },
        },
      },
      features: {
        sso: true,
        mfa: true,
        audit_log: true,
        advanced: {
          custom_roles: true,
          ip_allowlist: false,
          scim: {
            enabled: true,
            endpoint: 'https://api.example.com/scim/v2',
          },
        },
      },
    },
    teams: [
      {
        id: 'team_eng',
        name: 'Engineering',
        lead: { id: 'usr_001', name: 'Bob' },
      },
      {
        id: 'team_design',
        name: 'Design',
        lead: { id: 'usr_002', name: 'Carol' },
      },
    ],
  },
};

createRoot(document.getElementById('root')!).render(<Content data={data} />);
