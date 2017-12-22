import {format} from 'util';

type Units = 'px' | 'pt' | 'in' | 'cm' | 'mm' | 'pc' | 'em' | 'ex' | '%';
type FontStyle = 'normal' | 'italic' | 'oblique';
type FontVariant = 'normal' | 'small-caps';
type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;

class FontSize {
  public static readonly DEFAULT_UNITS = 'px';

  value: number;
  units ?: Units;

  constructor(value: number, units: Units = FontSize.DEFAULT_UNITS) {
    this.value = value;
    this.units = units;
  }

  static fromString(str: string): FontSize {
    const size = parseInt(str);
    const units = str.replace(size.toString(), '');
    if (units === '') {
      return new FontSize(size);
    }
    return new FontSize(size, units as Units);
  }

  toString(): string {
    return '' + this.value + this.units || FontSize.DEFAULT_UNITS;
  }
}

class Font {
  style ?: FontStyle;
  variant ?: FontVariant;
  weight: FontWeight;
  size: FontSize;
  lineWidth ?: FontSize;
  family: string;

  constructor(size: string,
              family: string,
              style: FontStyle = 'normal',
              weight: FontWeight = 'normal',
              variant: FontVariant = 'normal',
              lineWidth: string | null) {
    this.size = FontSize.fromString(size);
    this.family = family;
    this.lineWidth = FontSize.fromString(lineWidth || size);
    this.style = style;
    this.variant = variant;
    this.weight = weight;
  }

  toString(): string {
    return format('%s %s %s %s/%s %s', this.style || 'normal', this.variant || '',
      this.weight.toString(), this.size.toString(), (this.lineWidth || this.size).toString(), this.family);
  }
}