const shortcodes = require('../shortcodes');

const { col, row } = shortcodes.paired;
const { key } = shortcodes.single;

test('row', () => {
  expect(row('<p>test</p>')).toBe('<div class="row"><p>test</p></div>');
});

describe('col', () => {
  test('default span is 1', () => {
    expect(col('<p>test</p>')).toBe('<div class="col col--span-1"><p>test</p></div>');
  });
  test('span should be 12', () => {
    expect(col('<p>test</p>', '12')).toBe('<div class="col col--span-12"><p>test</p></div>');
  });
});

describe('key', () => {
  test('Split shortcut string', () => {
    expect(key('Ctrl+B,D'))
      .toBe('<span class="shortcut"><span class="key">Ctrl</span> + <span class="key">B</span> , <span class="key">D</span></span>');
  });
  test('Single key', () => {
    expect(key('Enter'))
      .toBe('<span class="shortcut"><span class="key">Enter</span></span>');
  });
});
