const convertToUTF8 = require('../src/convertToUTF8');

describe("convert to UTF8", () => {
  it('should convert "MichÃ¨le HuÃ " to "Michèle Huà"', () => {
    const output = 'Michèle Huà';
    const input = Buffer.from(output, 'utf8').toString('latin1');

    expect(convertToUTF8(input)).toBe(output);
  });
});
