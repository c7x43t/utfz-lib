const { makefn } = require("./generator");

function pack(str, length, buf, offset) {
  length = length | 0;
  offset = offset | 0;
  var start = offset | 0, currHigh = 0, code = 0, high = 0, low = 0, i = 0;
  for (; (i | 0) < (length | 0); i = (i + 1 | 0) >>> 0) {
    code = (str.charCodeAt(i) | 0) >>> 0;
    high = code >> 8;
    if ((high | 0) != (currHigh | 0)) {
      buf[i + offset++] = 0;
      buf[i + offset++] = (high | 0) >>> 0;
      currHigh = (high | 0) >>> 0;
    }
    low = ((code | 0) >>> 0) & 0xff;
    buf[i + offset | 0] = (low | 0) >>> 0;
    if ((low | 0) == 0) {
      buf[i + ++offset] = (currHigh | 0) >>> 0;
    }
  }
  return (length + offset - start | 0) >>> 0;
};

const fromCharCode = String.fromCharCode;

const fns = new Array(66).fill(null).map((v, i) => (i >= 3 ? makefn(i) : v));

const unpack = (buf, length, offset) => {
  if (length === 0) {
    return "";
  } else if (length === 1) {
    return fromCharCode(buf[offset]);
  } else if (length === 2) {
    const a = buf[offset++];
    if (a === 0) {
      return "\0";
    }
    return fromCharCode(a, buf[offset]);
  } else if (length <= 65) {
    return fns[length](buf, length, offset);
  }
  const end = offset + length;
  let currHighCode = 0;
  let currHigh = 0;
  const codes = [];
  for (let i = offset; i < end; i++) {
    const curr = buf[i];
    if (curr) {
      codes.push(curr + currHigh);
    } else {
      const next = buf[i + 1];
      i += 1;
      if (next === currHighCode) {
        codes.push(curr + currHigh);
      } else {
        currHighCode = next;
        currHigh = next << 8;
      }
    }
  }
  return fromCharCode.apply(null, codes);
};

module.exports.pack = pack;
module.exports.unpack = unpack;
