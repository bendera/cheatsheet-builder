function row(slot) {
  return `<div class="row">${slot}</div>`;
}

function col(slot, span = 1) {
  return `<div class="col col--span-${span}">${slot}</div>`;
}

function singleKey(keyLabel) {
  return `<span class="key">${keyLabel}</span>`;
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

function code(slot, style = 'default') {
  return `<code class="code code--${style}">${slot}</code>`;
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
