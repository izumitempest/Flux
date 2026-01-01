export interface Theme {
  name: string;
  primary: string; // Hex for primary glow
  secondary: string; // Hex for secondary lines
  bg: string; // Background css color
  accent: string; // Text accent color
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  baseX?: number;
  baseY?: number;
  type: 'NORMAL' | 'COMET';
  trail: {x: number, y: number}[];
}

export interface Star {
  x: number;
  y: number;
  z: number; // Depth factor (0.1 to 1)
  size: number;
  brightness: number;
}

export interface CelestialBody {
  type: 'PLANET' | 'BLACK_HOLE' | 'SUN';
  x: number;
  y: number;
  radius: number;
  color: string;
  orbitSpeed: number;
  angle: number;
  orbitRadius: number;
}

export interface Shockwave {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
}

export interface SystemStatus {
  message: string;
  isError: boolean;
  timestamp: Date;
}

export enum RenderMode {
  NET = 'NET',         // Classic lines
  MESH = 'MESH',       // Cyberpunk filled triangles
  PARTICLES = 'PARTICLES' // Minimalist
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  MEMBERS = 'MEMBERS',
  VOTING = 'VOTING',
  ADVISOR = 'ADVISOR'
}

export enum MemberStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending'
}

export interface Member {
  id: string;
  name: string;
  role: string;
  joinedDate: string;
  status: MemberStatus;
  avatar: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  endDate: string;
  status: 'Active' | 'Closed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}