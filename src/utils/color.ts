export const rgb2hex = (r: number, g: number, b: number) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

export const hex2rgba = (hex: string, opacity: number) => {
  const r = parseInt("0x" + hex.slice(1, 3));
  const g = parseInt("0x" + hex.slice(3, 5));
  const b = parseInt("0x" + hex.slice(5, 7));

  return {
    r,
    g,
    b,
    rgba: `rgba(${r},${g},${b},${opacity})`,
  };
};

export const random = (min: number, max: number) => ~~(Math.random() * (max - min) + min);

export const getRandomHex = () => rgb2hex(random(0, 255), random(0, 255), random(0, 255));
