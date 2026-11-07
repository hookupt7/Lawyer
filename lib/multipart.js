'use strict';
/**
 * Minimal multipart/form-data parser — enough for the admin upload forms.
 * Returns { fields: {name: string}, files: {name: {filename, contentType, data}} }.
 * No dependencies, no temp files.
 */
function parse(buf, boundary) {
  const fields = {};
  const files = {};
  if (!boundary) return { fields, files };

  const delim = Buffer.from('--' + boundary);
  let idx = buf.indexOf(delim);

  while (idx !== -1) {
    const next = buf.indexOf(delim, idx + delim.length);
    const end = next === -1 ? buf.length : next;

    let part = buf.slice(idx + delim.length, end);
    /* strip the CRLF that precedes the closing delimiter */
    if (part.length >= 2 && part[part.length - 2] === 13 && part[part.length - 1] === 10) {
      part = part.slice(0, part.length - 2);
    }
    if (part.length >= 2 && part[0] === 13 && part[1] === 10) part = part.slice(2);

    const sep = part.indexOf('\r\n\r\n');
    if (sep !== -1) {
      const head = part.slice(0, sep).toString('utf8');
      const body = part.slice(sep + 4);

      const nameM = /name="([^"]*)"/i.exec(head);
      const fileM = /filename="([^"]*)"/i.exec(head);
      const typeM = /Content-Type:\s*([^\r\n]+)/i.exec(head);
      const name = nameM ? nameM[1] : null;

      if (name) {
        if (fileM && fileM[1]) {
          if (body.length) {
            files[name] = {
              filename: fileM[1],
              contentType: typeM ? typeM[1].trim() : 'application/octet-stream',
              data: body
            };
          }
        } else if (!(name in fields)) {
          fields[name] = body.toString('utf8');
        }
      }
    }

    if (next === -1) break;
    idx = next;
  }

  return { fields, files };
}

module.exports = { parse };
