import React from 'react';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';

export type PinType = 'temple' | 'priest';

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  type: PinType;
}

interface IndiaMapProps {
  width?: number;
  height?: number;
  pins?: MapPin[];
  selectedPinId?: string;
  onPinPress?: (id: string) => void;
  highlightedStates?: string[];
}

const PIN_COLORS: Record<PinType, string> = {
  temple: '#1A3A5C',
  priest: '#C45B28',
};

const PIN_COLORS_SELECTED: Record<PinType, string> = {
  temple: '#0D2240',
  priest: '#8B3A12',
};

// Projection: map lat/long to SVG coordinates
// Full sovereign India: lat ~6.5 to ~37.5, lng ~68 to ~80.5 (Aksai Chin to ~80.3E)
// We use a bounding box that includes all territory per GoI
const MAP_BOUNDS = {
  minLat: 6,
  maxLat: 38,
  minLng: 67.5,
  maxLng: 97.5,
};

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * w;
  const y = h - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * h;
  return { x, y };
}

function toPath(coords: number[][], w: number, h: number): string {
  return coords
    .map(([lng, lat], i) => {
      const { x, y } = project(lat, lng, w, h);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ') + 'Z';
}

export function IndiaMap({
  width = 320,
  height = 400,
  pins = [],
  selectedPinId,
  onPinPress,
  highlightedStates = [],
}: IndiaMapProps) {
  const sortedPins = [...pins].sort((a, b) => {
    if (a.id === selectedPinId) return 1;
    if (b.id === selectedPinId) return -1;
    if (a.type === 'priest' && b.type === 'temple') return 1;
    if (a.type === 'temple' && b.type === 'priest') return -1;
    return 0;
  });

  const w = width;
  const h = height;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Full India outline -- includes J&K, Ladakh, Aksai Chin per GoI */}
      <Path
        d={getIndiaOutline(w, h)}
        fill="#ECEAE6"
        stroke="#C8C4BE"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

      {/* Highlighted onboarded states */}
      {highlightedStates.includes('Telangana') && (
        <Path d={getTelangana(w, h)} fill="#D6D0C8" stroke="#B8B2AA" strokeWidth={0.8} />
      )}
      {highlightedStates.includes('Andhra Pradesh') && (
        <Path d={getAndhraPradesh(w, h)} fill="#D6D0C8" stroke="#B8B2AA" strokeWidth={0.8} />
      )}
      {highlightedStates.includes('Tamil Nadu') && (
        <Path d={getTamilNadu(w, h)} fill="#D6D0C8" stroke="#B8B2AA" strokeWidth={0.8} />
      )}
      {highlightedStates.includes('Karnataka') && (
        <Path d={getKarnataka(w, h)} fill="#D6D0C8" stroke="#B8B2AA" strokeWidth={0.8} />
      )}
      {highlightedStates.includes('Maharashtra') && (
        <Path d={getMaharashtra(w, h)} fill="#D6D0C8" stroke="#B8B2AA" strokeWidth={0.8} />
      )}

      {/* Pins */}
      {sortedPins.map((pin) => {
        const { x, y } = project(pin.latitude, pin.longitude, w, h);
        const isSelected = pin.id === selectedPinId;
        const color = isSelected
          ? PIN_COLORS_SELECTED[pin.type]
          : PIN_COLORS[pin.type];
        const r = isSelected ? 7 : pin.type === 'temple' ? 4.5 : 3.5;

        return (
          <G key={pin.id} onPress={() => onPinPress?.(pin.id)}>
            <Circle cx={x} cy={y + 1} r={r + 1} fill="#00000010" />
            <Circle
              cx={x}
              cy={y}
              r={r}
              fill={color}
              stroke="#FFFFFF"
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            {isSelected && (
              <SvgText
                x={x}
                y={y - 13}
                textAnchor="middle"
                fontSize={9}
                fontWeight="700"
                fill={color}
              >
                {pin.label}
              </SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
}

// =============================================================
// INDIA OUTLINE -- per Government of India sovereign boundary
// Includes full J&K (incl. PoK/Gilgit-Baltistan), Ladakh,
// Aksai Chin, and Siachen as integral parts of India.
// Simplified polygon traced from Survey of India reference maps.
// =============================================================
function getIndiaOutline(w: number, h: number): string {
  const coords: number[][] = [
    // Start NW: Gilgit-Baltistan / PoK (sovereign India per GoI)
    [74.0, 37.0],
    [74.5, 36.8],
    [75.0, 36.9],
    [75.5, 36.5],
    // Siachen / Karakoram
    [76.0, 36.7],
    [76.8, 36.2],
    [77.0, 35.8],
    // Ladakh north
    [77.5, 35.5],
    [78.0, 35.5],
    // Aksai Chin -- GoI sovereign territory
    [78.5, 35.2],
    [79.0, 35.0],
    [79.5, 34.5],
    [80.0, 34.0],
    [80.3, 33.5],
    // J&K eastern edge to Himachal
    [79.5, 33.0],
    [79.0, 32.5],
    [78.5, 32.5],
    [78.0, 32.3],
    // Himachal / Uttarakhand
    [77.5, 31.5],
    [77.8, 31.0],
    [78.5, 30.5],
    [79.5, 30.5],
    [80.0, 30.2],
    [80.5, 30.0],
    // Nepal border
    [81.0, 30.0],
    [82.0, 29.5],
    [83.0, 29.0],
    [84.0, 28.5],
    [85.0, 28.0],
    [86.0, 27.5],
    [87.0, 27.0],
    [88.0, 26.8],
    // Sikkim / Bhutan border
    [88.5, 27.2],
    [89.0, 27.0],
    [89.5, 26.8],
    // NE corridor (Siliguri)
    [89.0, 26.2],
    [88.5, 26.0],
    // Northeast states
    [89.0, 25.5],
    [90.0, 25.5],
    [91.0, 25.5],
    [92.0, 25.5],
    [93.0, 26.0],
    [94.0, 26.5],
    [95.0, 27.0],
    [96.0, 27.5],
    [97.0, 28.0],
    // Arunachal Pradesh NE tip
    [97.3, 27.8],
    // Arunachal east boundary
    [97.0, 27.0],
    [96.5, 26.5],
    [96.0, 26.0],
    // Nagaland / Manipur / Mizoram east
    [95.5, 25.5],
    [95.0, 25.0],
    [94.5, 24.0],
    [93.5, 23.5],
    [93.0, 23.0],
    [93.0, 22.0],
    [92.5, 21.5],
    // Bangladesh border south
    [92.0, 21.0],
    [91.5, 21.5],
    [91.0, 22.0],
    [90.5, 22.0],
    [90.0, 22.0],
    [89.0, 22.0],
    [88.5, 22.5],
    // West Bengal coast
    [88.5, 22.0],
    [88.0, 21.5],
    // Odisha coast
    [87.5, 21.5],
    [87.0, 21.0],
    [86.5, 20.5],
    [86.0, 20.0],
    [85.5, 19.5],
    [85.0, 19.5],
    [84.5, 19.0],
    // Andhra coast
    [84.0, 18.5],
    [83.5, 18.0],
    [83.0, 17.5],
    [82.5, 17.0],
    [81.5, 16.5],
    [81.0, 16.0],
    [80.5, 15.5],
    [80.0, 14.5],
    [80.0, 13.5],
    [80.2, 13.0],
    // Tamil Nadu coast
    [80.0, 12.5],
    [79.8, 11.5],
    [79.8, 10.5],
    [79.5, 10.0],
    [79.0, 9.5],
    [78.5, 9.0],
    // Kanyakumari
    [78.0, 8.3],
    [77.5, 8.1],
    // Kerala coast
    [77.0, 8.5],
    [76.5, 9.0],
    [76.0, 9.5],
    [76.0, 10.0],
    [75.5, 10.5],
    [75.5, 11.0],
    [75.0, 11.8],
    [74.8, 12.5],
    [74.5, 13.0],
    [74.3, 14.0],
    // Goa
    [73.8, 15.0],
    [73.5, 15.5],
    // Maharashtra coast
    [73.0, 16.0],
    [73.0, 17.0],
    [72.8, 18.0],
    [72.8, 19.0],
    [72.8, 19.5],
    // Gujarat coast
    [72.5, 20.5],
    [72.0, 21.0],
    [71.5, 21.0],
    [71.0, 21.5],
    [70.5, 21.5],
    [70.0, 22.0],
    [69.5, 22.5],
    // Kutch
    [69.0, 23.0],
    [68.5, 23.5],
    [68.0, 23.5],
    [68.5, 24.0],
    [69.0, 24.5],
    // Rajasthan / Sindh border
    [70.0, 25.5],
    [70.5, 26.0],
    [71.0, 27.0],
    [71.0, 28.0],
    // Punjab border
    [71.5, 29.0],
    [72.0, 30.0],
    [73.0, 31.0],
    // J&K south (Jammu)
    [74.0, 32.5],
    [73.5, 33.5],
    [74.0, 34.5],
    [74.0, 35.5],
    // Back to start (PoK)
    [74.0, 37.0],
  ];
  return toPath(coords, w, h);
}

// =============================================================
// State outlines (simplified polygons for the 5 onboarded states)
// =============================================================

function getTelangana(w: number, h: number): string {
  const coords: number[][] = [
    [77.0, 19.5], [78.0, 19.5], [79.0, 19.0], [80.0, 18.5],
    [80.5, 18.0], [80.5, 17.0], [80.0, 16.5], [79.5, 16.0],
    [79.0, 16.0], [78.0, 15.5], [77.5, 16.0], [77.0, 16.5],
    [77.0, 17.5], [77.0, 19.5],
  ];
  return toPath(coords, w, h);
}

function getAndhraPradesh(w: number, h: number): string {
  const coords: number[][] = [
    [80.5, 18.0], [81.0, 17.5], [81.5, 17.0], [82.0, 16.5],
    [82.5, 16.0], [83.0, 16.5], [83.5, 17.0], [84.0, 17.5],
    [84.0, 16.5], [83.5, 16.0], [83.0, 15.5], [82.0, 15.0],
    [81.5, 15.0], [81.0, 14.5], [80.5, 14.0], [80.0, 13.5],
    [80.0, 14.0], [79.5, 14.5], [79.0, 15.0], [78.5, 15.0],
    [78.0, 15.5], [79.0, 16.0], [79.5, 16.0], [80.0, 16.5],
    [80.5, 17.0], [80.5, 18.0],
  ];
  return toPath(coords, w, h);
}

function getTamilNadu(w: number, h: number): string {
  const coords: number[][] = [
    [80.0, 13.5], [80.2, 13.0], [80.0, 12.5], [79.8, 11.5],
    [79.8, 10.5], [79.5, 10.0], [79.0, 9.5], [78.5, 9.0],
    [78.0, 8.3], [77.5, 8.1], [77.0, 8.5], [76.5, 9.0],
    [76.5, 9.5], [76.5, 10.0], [77.0, 10.5], [77.0, 11.0],
    [77.0, 11.5], [77.5, 12.0], [77.5, 12.5], [78.0, 13.0],
    [78.5, 13.0], [79.0, 13.0], [79.5, 13.0], [80.0, 13.5],
  ];
  return toPath(coords, w, h);
}

function getKarnataka(w: number, h: number): string {
  const coords: number[][] = [
    [74.0, 18.0], [75.0, 18.0], [76.0, 18.0], [77.0, 17.5],
    [77.0, 16.5], [77.5, 16.0], [78.0, 15.5], [78.5, 15.0],
    [78.5, 14.0], [78.0, 13.0], [77.5, 12.5], [77.5, 12.0],
    [77.0, 11.5], [77.0, 11.0], [76.5, 11.5], [76.0, 12.0],
    [75.5, 12.5], [75.0, 12.5], [74.5, 13.0], [74.3, 14.0],
    [74.0, 15.0], [74.0, 16.0], [74.0, 17.0], [74.0, 18.0],
  ];
  return toPath(coords, w, h);
}

function getMaharashtra(w: number, h: number): string {
  const coords: number[][] = [
    [72.8, 20.5], [73.5, 21.0], [74.0, 21.0], [75.0, 21.5],
    [76.0, 21.5], [77.0, 21.0], [78.0, 21.0], [79.0, 21.0],
    [80.0, 20.0], [80.0, 19.5], [79.5, 19.0], [78.5, 19.0],
    [77.5, 19.5], [77.0, 19.5], [77.0, 18.5], [76.5, 18.0],
    [76.0, 18.0], [75.0, 18.0], [74.0, 18.0], [73.5, 17.5],
    [73.0, 17.0], [72.8, 18.0], [72.8, 19.0], [72.8, 20.0],
    [72.8, 20.5],
  ];
  return toPath(coords, w, h);
}
