export function angleToPoints(angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x1: 0,
    y1: 0,
    x2: Math.cos(radians),
    y2: Math.sin(radians),
  };
}
