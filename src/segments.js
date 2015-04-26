const specials = [
  '/', '.', '*', '+', '?', '|',
  '(', ')', '[', ']', '{', '}', '\\'
];

const escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

// A Segment represents a segment in the original route description.
// Each Segment type provides an `eachChar` and `regex` method.
//
// The `eachChar` method invokes the callback with one or more character
// specifications. A character specification consumes one or more input
// characters.
//
// The `regex` method returns a regex fragment for the segment. If the
// segment is a dynamic or star segment, the regex fragment also includes
// a capture.
//
// A character specification contains:
//
// * `validChars`: a String with a list of all valid characters, or
// * `invalidChars`: a String with a list of all invalid characters
// * `repeat`: true if the character specification can repeat

export class StaticSegment {
  constructor(string) {
    this.string = string;
  }

  eachChar(callback) {
    for (let ch of this.string) {
      callback({ validChars: ch });
    }
  }

  regex() {
    return this.string.replace(escapeRegex, '\\$1');
  }

  generate() {
    return this.string;
  }
}

export class DynamicSegment {
  constructor(name) {
    this.name = name;
  }

  eachChar(callback) {
    callback({ invalidChars: '/', repeat: true });
  }

  regex() {
    return '([^/]+)';
  }

  generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  }
}

export class StarSegment {
  constructor(name) {
    this.name = name;
  }

  eachChar(callback) {
    callback({ invalidChars: '', repeat: true });
  }

  regex() {
    return '(.+)';
  }

  generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  }
}

export class EpsilonSegment {
  eachChar() {}
  regex() { return ''; }
  generate() { return ''; }
}
