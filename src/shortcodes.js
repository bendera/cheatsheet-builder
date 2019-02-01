const HighlightPairedShortcode = require('@11ty/eleventy-plugin-syntaxhighlight/src/HighlightPairedShortcode');
/**
 * @param {string} block
 * @param {Object[]} modifiers
 * @returns {string}
 */
function bemClassname(block, ...modifiers) {
  let className = modifiers.map(el => `${block}--${el}`).join(' ');
  className = className !== '' ? `${block} ${className}` : block;

  return className;
}

/**
 * @param {string} slot
 * @returns {string}
 */
function row(slot) {
  return `<div class="row">${slot}</div>`;
}

/**
 * @param {string} slot
 * @param {number} span
 * @returns {string}
 */
function col(slot, span = 1) {
  return `<div class="col col--span-${span}">${slot}</div>`;
}

/**
 * @param {string} keyLabel
 * @returns {string}
 */
function singleKey(keyLabel) {
  return `<kbd class="key">${keyLabel}</kbd>`;
}

/**
 * @param {string} sequence
 * @returns {string}
 */
function key(sequence) {
  const parts = sequence.split(/(\+|,)/);

  let html = '<span class="shortcut">';

  parts.forEach((part) => {
    html += part !== '+' && part !== ',' ? singleKey(part) : ` ${part} `;
  });

  html += '</span>';

  return html;
}

/**
 * @param {string} slot
 * @param {string} title
 * @param {...string} styles
 * @returns {string}
 */
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

/**
 * @param {string} slot
 * @param {string} caption
 * @param {...string} styles
 * @returns {string}
 */
function table(slot, caption, ...styles) {
  const captionHTML = caption !== '' ? `<caption>${caption}</caption>` : '';

  return `
    <table class="${bemClassname('table', ...styles)}">
      ${captionHTML}
      ${slot}
    </table>
  `;
}

/**
 * @param {string} caption
 * @returns {string}
 */
function tcaption(caption) {
  return `<caption>${caption}</caption>`;
}

/**
 * @param {string} tag
 * @param {...string} cells
 * @returns {string}
 */
function tableRow(tag, ...cells) {
  let html = '<tr>';

  cells.forEach((val) => {
    html += `<${tag}>${val}</${tag}>`;
  });

  html += '</tr>';

  return html;
}

/**
 * @param {...string} cells
 * @returns {string}
 */
function tr(...cells) {
  return tableRow('td', ...cells);
}

/**
 * @param {...string} cells
 * @returns {string}
 */
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

/**
 * @param {...string} cells
 * @returns {string}
 */
function thead(...cells) {
  let html = '<thead>';

  html += tableRow('th', ...cells);

  html += '</thead>';

  return html;
}

/**
 * @param {...string} cells
 * @returns {string}
 */
function tfoot(...cells) {
  let html = '<tfoot>';

  html += tableRow('td', ...cells);

  html += '</tfoot>';

  return html;
}

/**
 * @param {string} slot
 * @param {string} lang
 * @param {string} theme
 * @param {string} highlightNumbers
 * @returns {string}
 */
function code(slot, lang, theme = 'default', highlightNumbers) {
  let html = `<div class="${theme}">`;

  html += HighlightPairedShortcode(slot, lang, highlightNumbers);
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
