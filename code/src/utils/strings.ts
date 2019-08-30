interface StringUtils {
  fromUTF8Array: (data: Uint8Array) => string;
  toUTF8Array: (str: string) => Uint8Array;
  fromArrayBuffer: (data: ArrayBuffer) => Promise<string>;
  fromBlob: (blob: Blob) => Promise<string>;
  camelize: (str: string) => string;
  random: () => string;
  uuidv4: () => string;
}

const strings: StringUtils = {
  fromUTF8Array(data: Uint8Array): string {
    let str: string = "";
    for (let i = 0; i < data.length; i++) {
      let value = data[i];

      if (value < 0x80) {
        str += String.fromCharCode(value);
      } else if (value > 0xbf && value < 0xe0) {
        str += String.fromCharCode(
          ((value & 0x1f) << 6) | (data[i + 1] & 0x3f)
        );
        i += 1;
      } else if (value > 0xdf && value < 0xf0) {
        str += String.fromCharCode(
          ((value & 0x0f) << 12) |
            ((data[i + 1] & 0x3f) << 6) |
            (data[i + 2] & 0x3f)
        );
        i += 2;
      } else {
        // surrogate pair
        let charCode =
          (((value & 0x07) << 18) |
            ((data[i + 1] & 0x3f) << 12) |
            ((data[i + 2] & 0x3f) << 6) |
            (data[i + 3] & 0x3f)) -
          0x010000;

        str += String.fromCharCode(
          (charCode >> 10) | 0xd800,
          (charCode & 0x03ff) | 0xdc00
        );
        i += 3;
      }
    }

    return str;
  },
  fromArrayBuffer(data: ArrayBuffer): Promise<string> {
    const blob = new Blob([data], { type: "text/plain" });
    return this.fromBlob(blob);
  },
  toUTF8Array(str: string): Uint8Array {
    let utf8: number[] = [];
    for (let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);
      if (charCode < 0x80) {
        utf8.push(charCode);
      } else if (charCode < 0x800) {
        utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
      } else if (charCode < 0xd800 || charCode >= 0xe000) {
        utf8.push(
          0xe0 | (charCode >> 12),
          0x80 | ((charCode >> 6) & 0x3f),
          0x80 | (charCode & 0x3f)
        );
      } else {
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charCode =
          0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        utf8.push(
          0xf0 | (charCode >> 18),
          0x80 | ((charCode >> 12) & 0x3f),
          0x80 | ((charCode >> 6) & 0x3f),
          0x80 | (charCode & 0x3f)
        );
      }
    }
    return new Uint8Array(utf8);
  },

  fromBlob(blob: Blob): Promise<string> {
    return new Promise(function(resolve) {
      const reader = new FileReader();
      reader.onload = function() {
        resolve(String(reader.result || ""));
      };
      reader.readAsText(blob);
    });
  },

  camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  },
  random(): string {
    return Math.random()
      .toString(36)
      .substring(2, 7);
  },
  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  uuidv4(): string {
    let d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
};

export default strings;
