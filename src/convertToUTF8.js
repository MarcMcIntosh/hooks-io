
module.exports = function convertToUTF8(iso) {
  const buf = Buffer.from(iso, 'latin1');
  return buf.toString('utf-8');
};
