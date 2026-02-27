import React from 'react';
import Svg, { Path, Circle, Rect, G, Line, Polyline } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function TempleIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L15 8H9L12 2Z"
        fill={color}
        opacity={0.2}
      />
      <Path
        d="M12 2L15 8H9L12 2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 8H18V10H6V8Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path d="M7 10V20" stroke={color} strokeWidth={1.5} />
      <Path d="M11 10V20" stroke={color} strokeWidth={1.5} />
      <Path d="M13 10V20" stroke={color} strokeWidth={1.5} />
      <Path d="M17 10V20" stroke={color} strokeWidth={1.5} />
      <Path
        d="M4 20H20"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PriestIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={7} r={3.5} stroke={color} strokeWidth={1.5} />
      <Path
        d="M5.5 21C5.5 17.134 8.41 14 12 14C15.59 14 18.5 17.134 18.5 21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M12 3.5V2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M9.5 2.5H14.5"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MapPinIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C12 21 19 14.5 19 9.5C19 5.358 15.866 2 12 2C8.134 2 5 5.358 5 9.5C5 14.5 12 21 12 21Z"
        stroke={color}
        strokeWidth={1.5}
      />
      <Circle cx={12} cy={9.5} r={2.5} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function PhoneIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={7}
        y={2}
        width={10}
        height={20}
        rx={2}
        stroke={color}
        strokeWidth={1.5}
      />
      <Line
        x1={10}
        y1={18}
        x2={14}
        y2={18}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MicIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={9}
        y={2}
        width={6}
        height={11}
        rx={3}
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M5 10C5 13.866 8.134 17 12 17C15.866 17 19 13.866 19 10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Line
        x1={12}
        y1={17}
        x2={12}
        y2={21}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Line
        x1={9}
        y1={21}
        x2={15}
        y2={21}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={1.5} />
      <Path
        d="M16.5 16.5L21 21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6L15 12L9 18"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6L9 12L15 18"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SettingsIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.5} />
      <Path
        d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function StarIcon({ size = 24, color = '#B8860B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.5L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </Svg>
  );
}

export function CalendarIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={4}
        width={18}
        height={18}
        rx={2}
        stroke={color}
        strokeWidth={1.5}
      />
      <Line x1={3} y1={9} x2={21} y2={9} stroke={color} strokeWidth={1.5} />
      <Line x1={8} y1={2} x2={8} y2={5} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1={16} y1={2} x2={16} y2={5} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function ClockIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Polyline
        points="12,7 12,12 15,15"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UserIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.5} />
      <Path
        d="M4 21C4 16.582 7.582 13 12 13C16.418 13 20 16.582 20 21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function TrashIcon({ size = 24, color = '#C62828' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path
        d="M8 6V4C8 3.448 8.448 3 9 3H15C15.552 3 16 3.448 16 4V6"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M5 6L6 20C6 20.552 6.448 21 7 21H17C17.552 21 18 20.552 18 20L19 6"
        stroke={color}
        strokeWidth={1.5}
      />
      <Line x1={10} y1={10} x2={10} y2={17} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1={14} y1={10} x2={14} y2={17} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function GlobeIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.5} />
      <Path
        d="M3 12H21"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M12 3C14.5 5.5 15.5 8.5 15.5 12C15.5 15.5 14.5 18.5 12 21"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M12 3C9.5 5.5 8.5 8.5 8.5 12C8.5 15.5 9.5 18.5 12 21"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export function RupeeIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 4H17M7 8H17M12 8C12 12 16 12 16 16C16 19 13 20 12 20C10 20 8 18 7 16"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CheckIcon({ size = 24, color = '#2E7D32' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13L9 17L19 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function OmIcon({ size = 48, color = '#C45B28' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M14 30C14 30 10 28 10 23C10 18 14 16 17 16C20 16 22 18 22 20C22 22 20 24 18 24C16 24 15 23 15 22"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M22 20C22 20 24 16 28 16C32 16 35 19 35 23C35 27 32 30 28 32"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M28 32C28 32 24 34 22 36C20 38 20 40 22 42"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M35 23C35 23 38 22 38 18C38 14 35 12 33 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={33} cy={8} r={2} fill={color} />
      <Path
        d="M30 7C30 7 31 4 34 5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
