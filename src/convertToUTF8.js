
const sanitise  = (str) => str.replace(/\s?$/g, "\u00A0")

module.exports = function convertToUTF8(iso) {

  const buf = Buffer.from(sanitise(iso), 'latin1');
  return buf.toString('utf-8');
};
