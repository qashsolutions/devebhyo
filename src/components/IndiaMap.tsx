import React from 'react';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
}

interface IndiaMapProps {
  width?: number;
  height?: number;
  pins?: MapPin[];
  selectedPinId?: string;
  onPinPress?: (id: string) => void;
}

// Simplified projection: map lat/long to SVG coordinates
// India approx: lat 8-35, long 68-97
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
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Simplified India outline */}
      <Path
        d={getIndiaOutline(width, height)}
        fill={Colors.borderLight}
        stroke={Colors.border}
        strokeWidth={1.2}
      />
      {/* State boundaries for South India */}
      <Path
        d={getSouthIndiaStates(width, height)}
        fill="none"
        stroke={Colors.border}
        strokeWidth={0.8}
        strokeDasharray="3,3"
      />
      {/* Highlighted South India region */}
      <Path
        d={getSouthIndiaRegion(width, height)}
        fill={Colors.primaryLight}
        opacity={0.15}
        stroke={Colors.primary}
        strokeWidth={1}
      />
      {/* Temple pins */}
      {pins.map((pin) => {
        const { x, y } = project(pin.latitude, pin.longitude, width, height);
        const isSelected = pin.id === selectedPinId;
        return (
          <G key={pin.id} onPress={() => onPinPress?.(pin.id)}>
            {/* Pin shadow */}
            <Circle
              cx={x}
              cy={y + 1}
              r={isSelected ? 7 : 5}
              fill="#00000020"
            />
            {/* Pin circle */}
            <Circle
              cx={x}
              cy={y}
              r={isSelected ? 6 : 4}
              fill={isSelected ? Colors.primaryDark : Colors.primary}
              stroke={Colors.white}
              strokeWidth={isSelected ? 2 : 1.5}
            />
            {/* Label for selected pin */}
            {isSelected && (
              <SvgText
                x={x}
                y={y - 12}
                textAnchor="middle"
                fontSize={9}
                fontWeight="600"
                fill={Colors.text}
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
  // Simplified India outline using projected coordinates
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
  // Approximate state boundary lines for visual reference
  const lines = [
    // AP-Telangana boundary
    [[77, 16], [80, 16.5]],
    // Karnataka-TN boundary
    [[76, 12.5], [78, 12]],
    // Maharashtra-Karnataka boundary
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
