import React from 'react';
import { Shape, Side } from '../types';

interface SideDiagramProps {
  shape: Shape;
  activeSide: Side;
}

const ACTIVE_COLOR = '#FF6F00';
const NORMAL_COLOR = '#9E9E9E';
const FILL_COLOR = '#C8E6C9';
const STROKE_WIDTH = 3;
const ACTIVE_WIDTH = 6;

const RectangleDiagram: React.FC<{ activeSide: Side }> = ({ activeSide }) => (
  <svg width="220" height="140" viewBox="0 0 220 140" aria-hidden="true">
    {/* Fill */}
    <rect x="40" y="20" width="140" height="100" rx="4" fill={FILL_COLOR} />
    {/* Side A — topo */}
    <line x1="40" y1="20" x2="180" y2="20"
      stroke={activeSide === 'a' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'a' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side B — esquerda */}
    <line x1="40" y1="20" x2="40" y2="120"
      stroke={activeSide === 'b' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'b' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side C — base */}
    <line x1="40" y1="120" x2="180" y2="120"
      stroke={activeSide === 'c' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'c' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side D — direita */}
    <line x1="180" y1="20" x2="180" y2="120"
      stroke={activeSide === 'd' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'd' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
  </svg>
);

const TriangleDiagram: React.FC<{ activeSide: Side }> = ({ activeSide }) => (
  <svg width="220" height="140" viewBox="0 0 220 140" aria-hidden="true">
    {/* Fill */}
    <polygon points="110,15 195,125 25,125" fill={FILL_COLOR} />
    {/* Side A — topo-esquerda */}
    <line x1="110" y1="15" x2="25" y2="125"
      stroke={activeSide === 'a' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'a' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side B — topo-direita */}
    <line x1="110" y1="15" x2="195" y2="125"
      stroke={activeSide === 'b' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'b' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
    {/* Side C — base */}
    <line x1="25" y1="125" x2="195" y2="125"
      stroke={activeSide === 'c' ? ACTIVE_COLOR : NORMAL_COLOR}
      strokeWidth={activeSide === 'c' ? ACTIVE_WIDTH : STROKE_WIDTH}
      strokeLinecap="round" />
  </svg>
);

const SideDiagram: React.FC<SideDiagramProps> = ({ shape, activeSide }) =>
  shape === 'rectangle'
    ? <RectangleDiagram activeSide={activeSide} />
    : <TriangleDiagram activeSide={activeSide} />;

export default SideDiagram;
