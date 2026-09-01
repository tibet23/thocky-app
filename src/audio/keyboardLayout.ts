import { KeyCategory } from '../types';

export interface KeyDef {
  code: string;
  label: string;
  subLabel?: string;
  width: number; // width multiplier in "u" (1u = standard square key)
  category: KeyCategory;
}

// Standard 65% ANSI Mechanical Keyboard Layout
export const ANSI_65_LAYOUT: KeyDef[][] = [
  // Row 1 (Number Row)
  [
    { code: 'Escape', label: 'ESC', width: 1, category: 'modifier' },
    { code: 'Digit1', label: '1', subLabel: '!', width: 1, category: 'alphanumeric' },
    { code: 'Digit2', label: '2', subLabel: '@', width: 1, category: 'alphanumeric' },
    { code: 'Digit3', label: '3', subLabel: '#', width: 1, category: 'alphanumeric' },
    { code: 'Digit4', label: '4', subLabel: '$', width: 1, category: 'alphanumeric' },
    { code: 'Digit5', label: '5', subLabel: '%', width: 1, category: 'alphanumeric' },
    { code: 'Digit6', label: '6', subLabel: '^', width: 1, category: 'alphanumeric' },
    { code: 'Digit7', label: '7', subLabel: '&', width: 1, category: 'alphanumeric' },
    { code: 'Digit8', label: '8', subLabel: '*', width: 1, category: 'alphanumeric' },
    { code: 'Digit9', label: '9', subLabel: '(', width: 1, category: 'alphanumeric' },
    { code: 'Digit0', label: '0', subLabel: ')', width: 1, category: 'alphanumeric' },
    { code: 'Minus', label: '-', subLabel: '_', width: 1, category: 'alphanumeric' },
    { code: 'Equal', label: '=', subLabel: '+', width: 1, category: 'alphanumeric' },
    { code: 'Backspace', label: 'BACKSPACE', width: 2, category: 'backspace' },
    { code: 'Delete', label: 'DEL', width: 1, category: 'modifier' },
  ],
  // Row 2 (QWERTY)
  [
    { code: 'Tab', label: 'TAB', width: 1.5, category: 'modifier' },
    { code: 'KeyQ', label: 'Q', width: 1, category: 'alphanumeric' },
    { code: 'KeyW', label: 'W', width: 1, category: 'alphanumeric' },
    { code: 'KeyE', label: 'E', width: 1, category: 'alphanumeric' },
    { code: 'KeyR', label: 'R', width: 1, category: 'alphanumeric' },
    { code: 'KeyT', label: 'T', width: 1, category: 'alphanumeric' },
    { code: 'KeyY', label: 'Y', width: 1, category: 'alphanumeric' },
    { code: 'KeyU', label: 'U', width: 1, category: 'alphanumeric' },
    { code: 'KeyI', label: 'I', width: 1, category: 'alphanumeric' },
    { code: 'KeyO', label: 'O', width: 1, category: 'alphanumeric' },
    { code: 'KeyP', label: 'P', width: 1, category: 'alphanumeric' },
    { code: 'BracketLeft', label: '[', subLabel: '{', width: 1, category: 'alphanumeric' },
    { code: 'BracketRight', label: ']', subLabel: '}', width: 1, category: 'alphanumeric' },
    { code: 'Backslash', label: '\\', subLabel: '|', width: 1.5, category: 'alphanumeric' },
    { code: 'PageUp', label: 'PGUP', width: 1, category: 'modifier' },
  ],
  // Row 3 (Home Row)
  [
    { code: 'CapsLock', label: 'CAPS', width: 1.75, category: 'modifier' },
    { code: 'KeyA', label: 'A', width: 1, category: 'alphanumeric' },
    { code: 'KeyS', label: 'S', width: 1, category: 'alphanumeric' },
    { code: 'KeyD', label: 'D', width: 1, category: 'alphanumeric' },
    { code: 'KeyF', label: 'F', width: 1, category: 'alphanumeric' },
    { code: 'KeyG', label: 'G', width: 1, category: 'alphanumeric' },
    { code: 'KeyH', label: 'H', width: 1, category: 'alphanumeric' },
    { code: 'KeyJ', label: 'J', width: 1, category: 'alphanumeric' },
    { code: 'KeyK', label: 'K', width: 1, category: 'alphanumeric' },
    { code: 'KeyL', label: 'L', width: 1, category: 'alphanumeric' },
    { code: 'Semicolon', label: ';', subLabel: ':', width: 1, category: 'alphanumeric' },
    { code: 'Quote', label: '\'', subLabel: '"', width: 1, category: 'alphanumeric' },
    { code: 'Enter', label: 'ENTER', width: 2.25, category: 'enter' },
    { code: 'PageDown', label: 'PGDN', width: 1, category: 'modifier' },
  ],
  // Row 4 (Shift Row)
  [
    { code: 'ShiftLeft', label: 'SHIFT', width: 2.25, category: 'modifier' },
    { code: 'KeyZ', label: 'Z', width: 1, category: 'alphanumeric' },
    { code: 'KeyX', label: 'X', width: 1, category: 'alphanumeric' },
    { code: 'KeyC', label: 'C', width: 1, category: 'alphanumeric' },
    { code: 'KeyV', label: 'V', width: 1, category: 'alphanumeric' },
    { code: 'KeyB', label: 'B', width: 1, category: 'alphanumeric' },
    { code: 'KeyN', label: 'N', width: 1, category: 'alphanumeric' },
    { code: 'KeyM', label: 'M', width: 1, category: 'alphanumeric' },
    { code: 'Comma', label: ',', subLabel: '<', width: 1, category: 'alphanumeric' },
    { code: 'Period', label: '.', subLabel: '>', width: 1, category: 'alphanumeric' },
    { code: 'Slash', label: '/', subLabel: '?', width: 1, category: 'alphanumeric' },
    { code: 'ShiftRight', label: 'SHIFT', width: 1.75, category: 'modifier' },
    { code: 'ArrowUp', label: '▲', width: 1, category: 'arrow' },
    { code: 'End', label: 'END', width: 1, category: 'modifier' },
  ],
  // Row 5 (Bottom Row)
  [
    { code: 'ControlLeft', label: 'CTRL', width: 1.25, category: 'modifier' },
    { code: 'MetaLeft', label: 'WIN', width: 1.25, category: 'modifier' },
    { code: 'AltLeft', label: 'ALT', width: 1.25, category: 'modifier' },
    { code: 'Space', label: 'SPACEBAR', width: 6.25, category: 'spacebar' },
    { code: 'AltRight', label: 'ALT', width: 1, category: 'modifier' },
    { code: 'ControlRight', label: 'FN', width: 1, category: 'modifier' },
    { code: 'ArrowLeft', label: '◄', width: 1, category: 'arrow' },
    { code: 'ArrowDown', label: '▼', width: 1, category: 'arrow' },
    { code: 'ArrowRight', label: '►', width: 1, category: 'arrow' },
  ],
];

export function getKeyCategory(code: string): KeyCategory {
  if (code === 'Space') return 'spacebar';
  if (code === 'Enter' || code === 'NumpadEnter') return 'enter';
  if (code === 'Backspace') return 'backspace';
  if (code.startsWith('Arrow')) return 'arrow';
  if (code.startsWith('Numpad')) return 'numpad';
  if (
    code.startsWith('Shift') ||
    code.startsWith('Control') ||
    code.startsWith('Alt') ||
    code.startsWith('Meta') ||
    code === 'Tab' ||
    code === 'CapsLock' ||
    code === 'Escape' ||
    code === 'Delete' ||
    code === 'PageUp' ||
    code === 'PageDown' ||
    code === 'Home' ||
    code === 'End' ||
    code === 'Insert'
  ) {
    return 'modifier';
  }
  return 'alphanumeric';
}

export function getKeyDisplayName(code: string, key?: string): string {
  if (code === 'Space') return 'Space';
  if (code === 'Backspace') return '⌫ Back';
  if (code === 'Enter') return '↵ Enter';
  if (code === 'Tab') return '⇥ Tab';
  if (code === 'Escape') return 'ESC';
  if (code === 'CapsLock') return '⇪ Caps';
  if (code === 'ShiftLeft' || code === 'ShiftRight') return '⇧ Shift';
  if (code === 'ControlLeft' || code === 'ControlRight') return 'Ctrl';
  if (code === 'AltLeft' || code === 'AltRight') return 'Alt';
  if (code === 'MetaLeft' || code === 'MetaRight') return 'Win ⊞';
  if (code === 'ArrowUp') return '↑';
  if (code === 'ArrowDown') return '↓';
  if (code === 'ArrowLeft') return '←';
  if (code === 'ArrowRight') return '→';

  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (key && key.length === 1) return key.toUpperCase();
  return code;
}
