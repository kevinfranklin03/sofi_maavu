import React from 'react';

// Draw decorative UI symbols as vectors so phone fonts cannot turn them into emoji.
const paths = {
  arrow: 'M6 18 18 6M6 6h12v12',
  up: 'M12 19V5m-6 6 6-6 6 6',
  plus: 'M5 12h14M12 5v14',
  sunburst: 'M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2',
};

export default function Icon({ name = 'arrow' }) {
  return <svg className="ui-icon" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={paths[name]} />
  </svg>;
}
