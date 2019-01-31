const HighlightPairedShortcode = require('@11ty/eleventy-plugin-syntaxhighlight/src/HighlightPairedShortcode');
/**
 * @param {string} block
 * @param {Object[]} modifiers
 */
function bemClassname(block, ...modifiers) {
  let className = modifiers.map(el => `${block}--${el}`).join(' ');
  className = className !== '' ? `${block} ${className}` : block;

  return className;
}

/**
 * @param {string} slot
 */
function row(slot) {
  return `<div class="row">${slot}</div>`;
}

/**
 * @param {string} slot
 * @param {number} span
 */
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

function section(slot, title, ...styles) {
  let html = '';

  html += `<section class="${bemClassname('section', ...styles)}">`;
  html += `<h2 class="section__header">${title}</h2>`;
  html += '<div class="section__body">';
  html += slot;
  html += '</div>';
  html += '</section>';

  return html;
}

function table(slot, caption, ...styles) {
  const captionHTML = caption !== '' ? `<caption>${caption}</caption>` : '';

  return `
    <table class="${bemClassname('table', ...styles)}">
      ${captionHTML}
      ${slot}
    </table>
  `;
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

function thr(...cells) {
  let html = '<tr>';

  cells.forEach((val, index) => {
    html += index === 0 ? '<th scope="row">' : '<td>';
    html += val;
    html += index === 0 ? '</th>' : '</td>';
  });

  html += '</tr>';

  return html;
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
    section,
    code,
  },
  single: {
    key,
    tcaption,
    tr,
    thr,
    thead,
    tfoot,
  },
};
