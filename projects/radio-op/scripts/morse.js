var DOT = "•";
var DASH = "—";

var morseCodeData = [
    {
        character: "A",
        pattern: [DOT, DASH]
    }, {
        character: "B",
        pattern: [DASH, DOT, DOT, DOT]
    }, {
        character: "C",
        pattern: [DASH, DOT, DASH, DOT]
    }, {
        character: "D",
        pattern: [DASH, DOT, DOT]
    }, {
        character: "E",
        pattern: [DOT]
    }, {
        character: "F",
        pattern: [DOT, DOT, DASH, DOT]
    }, {
        character: "G",
        pattern: [DASH, DASH, DOT]
    }, {
        character: "H",
        pattern: [DOT, DOT, DOT, DOT]
    }, {
        character: "I",
        pattern: [DOT, DOT]
    }, {
        character: "J",
        pattern: [DOT, DASH, DASH, DASH]
    }, {
        character: "K",
        pattern: [DASH, DOT, DASH]
    }, {
        character: "L",
        pattern: [DOT, DASH, DOT, DOT]
    }, {
        character: "M",
        pattern: [DASH, DASH]
    }, {
        character: "N",
        pattern: [DASH, DOT]
    }, {
        character: "O",
        pattern: [DASH, DASH, DASH]
    }, {
        character: "P",
        pattern: [DOT, DASH, DASH, DOT]
    }, {
        character: "Q",
        pattern: [DASH, DASH, DOT, DASH]
    }, {
        character: "R",
        pattern: [DOT, DASH, DOT]
    }, {
        character: "S",
        pattern: [DOT, DOT, DOT]
    }, {
        character: "T",
        pattern: [DASH]
    }, {
        character: "U",
        pattern: [DOT, DOT, DASH]
    }, {
        character: "V",
        pattern: [DOT, DOT, DOT, DASH]
    }, {
        character: "W",
        pattern: [DOT, DASH, DASH]
    }, {
        character: "X",
        pattern: [DASH, DOT, DOT, DASH]
    }, {
        character: "Y",
        pattern: [DASH, DOT, DASH, DASH]
    }, {
        character: "Z",
        pattern: [DASH, DASH, DOT, DOT]
    }
];

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function getPattern(character) {
    for (var i in morseCodeData) {
        var data = morseCodeData[i]
        if (data.character == character.toUpperCase()) {
            return data.pattern;
        }
    }
}

function getPatternString(character) {
    var pattern = getPattern(character);
    var str = "";
    for (var i in pattern) {
        str += " " + pattern[i];
    }
    return str.substring(1);
}

function getCharacter(pattern) {
    for (var data in morseCodeData) {
        if (arraysEqual(pattern, data.pattern)) {
            return data.pattern;
        }
    }
}
