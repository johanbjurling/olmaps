import L from "leaflet";

export const CrossHairIcon = (zoom: number) => {
  const crossSize = Math.pow(2, zoom - 10) * 1.5;
  const finalSize = Math.max(10, Math.min(crossSize, 150));
  const half = finalSize / 2;

  return L.divIcon({
    html: `
      <svg width="${finalSize}" height="${finalSize}" viewBox="0 0 ${finalSize} ${finalSize}" 
           style="margin-left: -${half}px; margin-top: -${half}px; display: block;">
        <line x1="${half}" y1="0" x2="${half}" y2="${finalSize}" stroke="black" stroke-width="2" />
        <line x1="0" y1="${half}" x2="${finalSize}" y2="${half}" stroke="black" stroke-width="2" />
      </svg>`,
    className: "custom-crosshair",
    iconSize: [0, 0],
  });
};
