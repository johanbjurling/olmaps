"use client";

import L from "leaflet";

export const useMapConfig = () => {
  const extent = [
    662158.0538812189, 6567716.593172748, 667687.8833337717, 6571161.757664087,
  ];

  const minZoom = 0;
  const maxZoom = 3;
  const maxResolution = 1;
  const minResolution = Math.pow(2, maxZoom) * maxResolution;
  const crs = L.CRS.Simple;
  crs.transformation = new L.Transformation(1, 0, -1, 0);
  crs.projection.bounds = L.bounds([0, 0], [extent[2], extent[3]]);

  crs.scale = function (zoom) {
    return Math.pow(2, zoom) / minResolution;
  };
  crs.zoom = function (scale) {
    return Math.log(scale * minResolution) / Math.LN2;
  };
  crs.infinite = false;

  const mapBounds = L.latLngBounds(
    [extent[1], extent[0]],
    [extent[3], extent[2]]
  );

  return { crs, mapBounds, minZoom, maxZoom };
};
