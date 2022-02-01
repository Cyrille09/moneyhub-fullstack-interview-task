const _get = require('lodash.get');

function createCSV(columns, data = []) {
  let output = ``;

  // Create the Column Headings
  columns.forEach((column, index) => {
    if (index > 0) {
      output += ',';
    }
    output += `"${typeof column === 'string' ? column : column.label}"`;
  });

  // Create the rows
  data.forEach(item => {
    output += `\n`;
    columns.forEach((column, index) => {
      if (index > 0) {
        output += ',';
      }

      let value;
      // Strings
      if (typeof column === 'string') {
        value = _get(item, column, '');
      }
      // Targets
      if (typeof column.target === 'string') {
        value = _get(item, column.target, '');
      }
      // Functions
      if (typeof column.target === 'function') {
        value = column.target(item);
      }

      value = (value || '').toString().replace(/"/g, '""');

      output += `"${value}"`;
    });
  });

  return output;
}
module.exports.createCSV = createCSV;
