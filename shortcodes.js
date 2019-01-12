function row(slot) {
  return `<div class="row">${slot}</div>`;
}

function col(slot, span = 1) {
  return `<div class="col col--span-${span}">${slot}</div>`;
}

function singleKey(code) {
  return `<span class="key">${code}</span>`;
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

module.exports = {
  paired: {
    row,
    col,
  },
  single: {
    key,
  },
};