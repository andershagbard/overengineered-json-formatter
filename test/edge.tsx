import Content from 'content/Content';
import 'css/app.css';
import { createRoot } from 'react-dom/client';

const data = {
  // Null and booleans
  null_value: null,
  true_value: true,
  false_value: false,

  // Numbers
  zero: 0,
  negative: -42,
  float: 3.141592653589793,
  large: 9007199254740991,

  // Empty containers
  empty_object: {},
  empty_array: [],

  // Nested empties
  nested_empties: {
    a: {},
    b: [],
    c: { d: {} },
  },

  // Long string
  long_string:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',

  // Keys with special characters
  'key with spaces': 'value',
  'key-with-dashes': 'value',
  key_with_underscores: 'value',
  'key.with.dots': 'value',
  '123numeric_start': 'value',

  // Unicode
  emoji_key: '🎉',
  unicode_string: 'こんにちは世界',

  // Mixed array
  mixed_array: [1, 'two', true, null, { nested: 'object' }, [1, 2, 3]],
};

createRoot(document.getElementById('root')!).render(<Content data={data} />);
