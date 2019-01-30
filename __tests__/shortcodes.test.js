const shortcodes = require('../src/shortcodes');

const { table, col, row } = shortcodes.paired;
const {
  key,
  tr,
  thr,
  thead,
  tfoot,
} = shortcodes.single;

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
      .toBe('<span class="shortcut"><kbd class="key">Ctrl</kbd> + <kbd class="key">B</kbd> , <kbd class="key">D</kbd></span>');
  });
  test('Single key', () => {
    expect(key('Enter'))
      .toBe('<span class="shortcut"><kbd class="key">Enter</kbd></span>');
  });
});

describe('table', () => {
  test('Default style', () => {
    expect(table('<tr><td>Lorem</td></tr>'))
      .toBe('<table class="table"><tr><td>Lorem</td></tr></table>');
  });
  test('Multiple styles', () => {
    expect(table('<tr><td>Lorem</td></tr>', 'lorem', 'ipsum'))
      .toBe('<table class="table table--lorem table--ipsum"><tr><td>Lorem</td></tr></table>');
  });
});

describe('tr', () => {
  test('Single column', () => {
    expect(tr('Lorem'))
      .toBe('<tr><td>Lorem</td></tr>');
  });
  test('Multiple columns', () => {
    expect(tr('Lorem', 'Ipsum', 'Dolor', 'Sit'))
      .toBe('<tr><td>Lorem</td><td>Ipsum</td><td>Dolor</td><td>Sit</td></tr>');
  });
});

describe('thr', () => {
  test('Single column', () => {
    expect(thr('Lorem'))
      .toBe('<tr><th scope="row">Lorem</th></tr>');
  });
  test('Multiple columns', () => {
    expect(thr('Lorem', 'Ipsum', 'Dolor', 'Sit'))
      .toBe('<tr><th scope="row">Lorem</th><td>Ipsum</td><td>Dolor</td><td>Sit</td></tr>');
  });
});

describe('thead', () => {
  test('Single column', () => {
    expect(thead('Lorem'))
      .toBe('<thead><tr><th>Lorem</th></tr></thead>');
  });
  test('Multiple columns', () => {
    expect(thead('Lorem', 'Ipsum', 'Dolor', 'Sit'))
      .toBe('<thead><tr><th>Lorem</th><th>Ipsum</th><th>Dolor</th><th>Sit</th></tr></thead>');
  });
});

describe('tfoot', () => {
  test('Single column', () => {
    expect(tfoot('Lorem'))
      .toBe('<tfoot><tr><td>Lorem</td></tr></tfoot>');
  });
  test('Multiple columns', () => {
    expect(tfoot('Lorem', 'Ipsum', 'Dolor', 'Sit'))
      .toBe('<tfoot><tr><td>Lorem</td><td>Ipsum</td><td>Dolor</td><td>Sit</td></tr></tfoot>');
  });
});
