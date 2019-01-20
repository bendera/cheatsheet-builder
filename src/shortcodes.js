const HighlightPairedShortcode = require('@11ty/eleventy-plugin-syntaxhighlight/src/HighlightPairedShortcode');
const stripIndent = require('strip-indent');

function row(slot) {
  return `<div class="row">${slot}</div>`;
}

function col(slot, span = 1) {
  return `<div class="col col--span-${span}">${slot}</div>`;
}

function singleKey(keyLabel) {
  return `<kbd class="key">${keyLabel}</kbd>`;
}

function key(sequence) {
  const parts = sequence.split(/(\+|,)/);

  let html = '<span class="shortcut">';

  parts.forEach((part) => {
    html += part !== '+' && part !== ',' ? singleKey(part) : ` ${part} `;
  });

  html += '</span>';

  return html;
}

function table(slot, ...styles) {
  let classes = [...styles];

  classes = classes.map(e => `table--${e}`);
  classes = ['table', ...classes];

  return `<table class="${classes.join(' ')}">${slot}</table>`;
}

function tcaption(caption) {
  return `<caption>${caption}</caption>`;
}

function tableRow(tag, ...cells) {
  let html = '<tr>';

  cells.forEach((val) => {
    html += `<${tag}>${val}</${tag}>`;
  });

  html += '</tr>';

  return html;
}

function tr(...cells) {
  return tableRow('td', ...cells);
}

function thead(...cells) {
  let html = '<thead>';

  html += tableRow('th', ...cells);

  html += '</thead>';

  return html;
}

function tfoot(...cells) {
  let html = '<tfoot>';

  html += tableRow('td', ...cells);

  html += '</tfoot>';

  return html;
}

function code(slot, lang, theme = 'default', highlightNumbers) {
  let html = `<div class="${theme}">`;

  html += HighlightPairedShortcode(stripIndent(slot), lang, highlightNumbers);
  html += '</div>';

  return html;
}

module.exports = {
  paired: {
    row,
    col,
    table,
    code,
  },
  single: {
    key,
    tcaption,
    tr,
    thead,
    tfoot,
  },
};
