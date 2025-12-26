import proj4 from "proj4";

export function toDMS(lat, lng) {
  const convert = (coord, isLat) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees) * 60 - minutes) * 60;
    const direction = coord >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
    return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`;
  };
  return { lat: convert(lat, true), lng: convert(lng, false) };
}

export function toUTM(lat, lng) {
  // WGS84 ke UTM zone otomatis (contoh zone 49S untuk Jawa Tengah)
  const utmProj = "+proj=utm +zone=49 +south +datum=WGS84 +units=m +no_defs";
  const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";
  const [x, y] = proj4(wgs84, utmProj, [lng, lat]);
  return { easting: x.toFixed(2), northing: y.toFixed(2) };
}
