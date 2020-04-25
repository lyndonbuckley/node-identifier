export interface IdentifierInstanceOptions {
  buffer?: Buffer;
  alphabet?: string;
  minLength?: number;
}
export class IdentifierInstance {
  buffer: Buffer;
  alphabet: string;
  minLength: number;

  constructor(opts?: IdentifierInstanceOptions) {
    this.buffer = (opts ? opts.buffer : undefined) || Buffer.alloc(0);
    this.alphabet =
      (opts ? opts.alphabet : undefined) || '0123456789ABCDEFGHIJKLMNOPQRSTVWXYZabcdefghijklmnopqrstvwxyz';
    this.minLength = (opts ? opts.minLength : undefined) || 0;
  }

  fromBuffer(buffer: Buffer): this {
    let pos: number = 0;
    for (let i: number = 0; i <= buffer.length; i++) {
      if (buffer[i] !== 0x00) {
        pos = i;
        break;
      }
    }
    this.buffer = buffer.slice(pos);
    return this;
  }

  toBuffer() {
    return this.buffer;
  }

  fromHex(hex: string): this {
    if (hex.length % 2) hex = '0' + hex;
    this.buffer = Buffer.from(hex, 'hex');
    return this;
  }

  toHex() {
    return this.buffer.toString('hex');
  }

  fromUUID(uuid: string): this {
    return this.fromHex(uuid.replace(/-/g, ''));
  }

  toUUID(): string {
    const hex = this.toHex().padStart(32, '0');
    const sections: string[] = [];
    sections.push(hex.substr(0, 8));
    sections.push(hex.substr(8, 4));
    sections.push(hex.substr(12, 4));
    sections.push(hex.substr(16, 4));
    sections.push(hex.substr(20));
    return sections.join('-');
  }

  fromString(stringInput: string, alphabet?: string): this {
    return this.fromBuffer(require('base-x')(alphabet || this.alphabet).decode(stringInput));
  }

  toString(minLength: number, alphabet?: string): string;
  toString(alphabet: string, minLength?: number): string;
  toString(arg1?: string | number, arg2?: string | number): string {
    const optMinimumLength: number = typeof arg1 === 'number' ? arg1 : typeof arg2 === 'number' ? arg2 : this.minLength;
    const optAlphabet: string = typeof arg1 === 'string' ? arg1 : typeof arg2 === 'string' ? arg2 : this.alphabet;
    return require('base-x')(optAlphabet).encode(this.buffer).padStart(optMinimumLength, optAlphabet[0]);
  }

  fromInt(numberInput: number): this {
    return this.fromHex(numberInput.toString(16));
  }

  toInt() {
    return parseInt(this.toHex(), 16);
  }

  fromBigInt(bigInt: BigInt): this {
    return this.fromHex(bigInt.toString(16));
  }

  toBigInt() {
    return BigInt('0x' + this.toHex());
  }

  generateObjectId(): this {
    const time = new Date().getTime();

    let value: string = '';
    value += Math.floor(time / 1000)
      .toString(16)
      .padStart(8, '0');
    value += (time % 1000).toString(16).padStart(4, '0');
    while (value.length < 24) value += ((Math.random() * 16) || 0).toString(16);

    return this.fromHex(value);
  }

  generateBigInt() {
    const time = new Date().getTime();

    let value: string = '';
    value += Math.floor(time / 1000)
      .toString(16)
      .padStart(8, '0');
    value += (time % 1000).toString(16).padStart(4, '0');
    while (value.length < 16) value += ((Math.random() * 16) || 0).toString(16);

    return this.fromHex(value);
  }

  generateUUID(version?: 1 | 4): this {
    switch (version) {
      case 1:
        return this.fromUUID(require('uuid').v1());
      case 4:
      default:
        return this.fromUUID(require('uuid').v4());
    }
  }
}

export function Identifier(opts?: IdentifierInstanceOptions) {
  return new IdentifierInstance(opts);
}
