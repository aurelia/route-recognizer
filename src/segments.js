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
  constructor(string: string, caseSensitive: boolean) {
    this.string = string;
    this.caseSensitive = caseSensitive;
  }

  eachChar(callback: (spec: CharSpec) => void): void {
    let s = this.string;
    for (let i = 0, ii = s.length; i < ii; ++i) {
      let ch = s[i];
      callback({ validChars: this.caseSensitive ? ch : ch.toUpperCase() + ch.toLowerCase() });
    }
  }

  regex(): string {
    return this.string.replace(escapeRegex, '\\$1');
  }

  generate(): string {
    return this.string;
  }
}

export class DynamicSegment {
  constructor(name: string, optional: boolean) {
    this.name = name;
    this.optional = optional;
  }

  eachChar(callback: (spec: CharSpec) => void): void {
    callback({ invalidChars: '/', repeat: true });
  }

  regex(): string {
    return '([^/]+)';
  }

  generate(params: Object, consumed: Object): string {
    consumed[this.name] = true;
    return params[this.name];
  }
}

export class StarSegment {
  constructor(name: string) {
    this.name = name;
  }

  eachChar(callback: (spec: CharSpec) => void): void {
    callback({ invalidChars: '', repeat: true });
  }

  regex(): string {
    return '(.+)';
  }

  generate(params: Object, consumed: Object): string {
    consumed[this.name] = true;
    return params[this.name];
  }
}

export class EpsilonSegment {
  eachChar(): void {
  }

  regex(): string {
    return '';
  }

  generate(): string {
    return '';
  }
}
