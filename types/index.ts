// Core type definitions for the CnC Tiberium Alliances Lineup Optimizer

export type Faction = 'nod' | 'gdi' | 'forgotten'
export type UnitType = 'infantry' | 'vehicle' | 'air'
export type ArmorType = 'light' | 'medium' | 'heavy' | 'air'
export type TargetType = 'camp' | 'outpost' | 'base'
export type BattleResult = 'victory' | 'defeat'
export type Objective = 'min_repair_time' | 'min_power_cost' | 'max_loot_per_minute' | 'max_win_chance'

// Unit in player roster
export interface RosterUnit {
  unitKey: string
  level: number
  count?: number
}

// Defender unit
export interface DefenderUnit {
  unitKey: string
  level: number
  count?: number
}

// Defense building
export interface DefenseBuilding {
  buildingKey: string
  approxPos?: { x: number; y: number }
  level?: number
}

// Target information (enemy base/camp/outpost)
export interface Target {
  type: TargetType
  level?: number
  defenderUnits: DefenderUnit[]
  defenseBuildings: DefenseBuilding[]
  terrainTags?: string[]
}

// Extracted data from screenshots
export interface ExtractedData {
  playerRoster: RosterUnit[]
  target: Target
}

// Input images for analysis
export interface AnalysisInputs {
  rosterImageUrl: string
  targetImageUrl: string
  defendersImageUrl?: string
}

// Lineup recommendation
export interface LineupUnit {
  unitKey: string
  desiredLevel: number
  count: number
}

// Wave plan
export interface WavePlan {
  wave: number
  units: LineupUnit[]
  strategy: string
}

// Single lineup recommendation
export interface LineupRecommendation {
  lineup: LineupUnit[]
  wavePlan: WavePlan[]
  score: number
  risk: number
  explanation: string
  cpTotal: number
}

// Analysis recommendations
export interface Recommendations {
  top: LineupRecommendation
  alternatives: LineupRecommendation[]
}

// Analysis document (Firestore)
export interface Analysis {
  id: string
  uid: string
  createdAt: Date
  objective: Objective
  inputs: AnalysisInputs
  extracted: ExtractedData
  recommendations: Recommendations
  version: string
}

// Battle report loot
export interface BattleLoot {
  tib: number
  cry: number
  power: number
  credits: number
}

// Battle report extracted data
export interface BattleReportData {
  result: BattleResult
  repairTimeSeconds: number
  repairCostPower: number
  repairCostCrystal?: number
  remainingArmyPct: number
  loot: BattleLoot
}

// Battle report document (Firestore)
export interface BattleReport {
  id: string
  uid: string
  analysisId?: string
  createdAt: Date
  reportImageUrl: string
  extracted: BattleReportData
  notes?: string
}

// User document (Firestore)
export interface User {
  uid: string
  displayName: string
  email?: string
  createdAt: Date
  settings: UserSettings
}

// User settings
export interface UserSettings {
  defaultObjective: Objective
  faction?: Faction
  language: string
}

// Unit stats
export interface UnitStats {
  unitKey: string
  name: string
  faction: Faction
  type: UnitType
  apCost: number
  armorType: ArmorType
  range: number
  speed: number
  hpByLevel?: Record<number, number>
  dpsByLevel?: Record<number, number>
  damageVs?: {
    infantry: number
    vehicle: number
    structure: number
    air: number
  }
  source?: string
  lastUpdatedAt?: Date
  confidence?: 'high' | 'medium' | 'low'
}

// Preset lineup
export interface PresetLineup {
  id: string
  uid: string
  name: string
  description?: string
  lineup: LineupUnit[]
  wavePlan?: WavePlan[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface AnalyzeRequest {
  objective: Objective
  rosterImageUrl: string
  targetImageUrl: string
  defendersImageUrl?: string
}

export interface AnalyzeResponse {
  analysisId: string
}

export interface ReportRequest {
  analysisId?: string
  reportImageUrl: string
}

export interface ReportResponse {
  reportId: string
}
