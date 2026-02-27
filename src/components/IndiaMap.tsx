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
}

const PIN_COLORS: Record<PinType, string> = {
  temple: '#1A3A5C',   // dark blue
  priest: '#C45B28',   // saffron
};

const PIN_COLORS_SELECTED: Record<PinType, string> = {
  temple: '#0D2240',
  priest: '#8B3A12',
};

// Simplified projection: map lat/long to SVG coordinates
function project(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - 68) / (97 - 68)) * width;
  const y = height - ((lat - 6) / (37 - 6)) * height;
  return { x, y };
}

export function IndiaMap({
  width = 320,
  height = 380,
  pins = [],
  selectedPinId,
  onPinPress,
}: IndiaMapProps) {
  // Render temples first, then priests on top, selected always on top
  const sortedPins = [...pins].sort((a, b) => {
    if (a.id === selectedPinId) return 1;
    if (b.id === selectedPinId) return -1;
    if (a.type === 'priest' && b.type === 'temple') return 1;
    if (a.type === 'temple' && b.type === 'priest') return -1;
    return 0;
  });

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* India outline */}
      <Path
        d={getIndiaOutline(width, height)}
        fill="#F0EDE8"
        stroke="#D8D3CC"
        strokeWidth={1.2}
      />
      {/* South India region */}
      <Path
        d={getSouthIndiaRegion(width, height)}
        fill="#E8E4DF"
        opacity={0.6}
        stroke="#C8C2BA"
        strokeWidth={0.8}
      />
      {/* State hints */}
      <Path
        d={getSouthIndiaStates(width, height)}
        fill="none"
        stroke="#C8C2BA"
        strokeWidth={0.6}
        strokeDasharray="3,3"
      />
      {/* Pins */}
      {sortedPins.map((pin) => {
        const { x, y } = project(pin.latitude, pin.longitude, width, height);
        const isSelected = pin.id === selectedPinId;
        const color = isSelected
          ? PIN_COLORS_SELECTED[pin.type]
          : PIN_COLORS[pin.type];
        const r = isSelected ? 7 : pin.type === 'temple' ? 4.5 : 4;

        return (
          <G key={pin.id} onPress={() => onPinPress?.(pin.id)}>
            <Circle cx={x} cy={y + 1} r={r + 1} fill="#00000012" />
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
                y={y - 14}
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

function getIndiaOutline(w: number, h: number): string {
  const pts = [
    [73, 34], [77, 35], [80, 33], [85, 28], [88, 27],
    [92, 27], [97, 28], [96, 25], [93, 23], [90, 22],
    [89, 22], [88, 24], [86, 21], [84, 19], [82, 17],
    [81, 16], [80, 14], [80, 12], [79, 9], [78, 8],
    [77, 8.5], [76, 10], [75, 11], [74, 13], [73, 15],
    [72, 19], [70, 21], [68, 23], [69, 25], [70, 27],
    [71, 29], [72, 32], [73, 34],
  ].map(([lng, lat]) => project(lat, lng, w, h));
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
}

function getSouthIndiaStates(w: number, h: number): string {
  const lines = [
    [[77, 16], [80, 16.5]],
    [[76, 12.5], [78, 12]],
    [[73, 16], [77, 16.5]],
  ];
  return lines.map(line => {
    const pts = line.map(([lng, lat]) => project(lat, lng, w, h));
    return `M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y}`;
  }).join(' ');
}

function getSouthIndiaRegion(w: number, h: number): string {
  const pts = [
    [73, 20], [80, 20], [84, 18], [82, 15],
    [80, 12], [79, 9], [78, 8], [77, 8.5],
    [76, 10], [75, 11], [74, 13], [73, 15], [72, 18],
    [73, 20],
  ].map(([lng, lat]) => project(lat, lng, w, h));
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
}
