import {
  ExtractedData,
  Objective,
  LineupRecommendation,
  LineupUnit,
  WavePlan,
  RosterUnit,
  DefenderUnit,
  Recommendations,
} from '@/types'
import unitStatsData from '@/data/unit_stats.seed.json'

const unitStats = unitStatsData.units

// Default CP limit (can be made configurable)
const DEFAULT_CP_LIMIT = 500

export interface EngineOptions {
  cpLimit?: number
  playerLevel?: number
}

/**
 * Main recommendation engine that generates lineup suggestions
 */
export function generateRecommendations(
  extracted: ExtractedData,
  objective: Objective,
  options: EngineOptions = {}
): Recommendations {
  const cpLimit = options.cpLimit || DEFAULT_CP_LIMIT

  // Generate primary recommendation
  const top = generateLineup(extracted, objective, cpLimit, options)

  // Generate alternative lineups with different strategies
  const alternatives: LineupRecommendation[] = []

  // Alternative 1: More defensive (extra soak)
  if (objective !== 'min_repair_time') {
    const defensive = generateLineup(
      extracted,
      'min_repair_time',
      cpLimit,
      options
    )
    alternatives.push(defensive)
  }

  // Alternative 2: Faster attack (if not already the objective)
  if (objective !== 'max_loot_per_minute') {
    const fast = generateLineup(
      extracted,
      'max_loot_per_minute',
      cpLimit * 0.9, // Slightly less CP for faster
      options
    )
    alternatives.push(fast)
  }

  return {
    top,
    alternatives: alternatives.slice(0, 2),
  }
}

/**
 * Generate a single lineup recommendation
 */
function generateLineup(
  extracted: ExtractedData,
  objective: Objective,
  cpLimit: number,
  options: EngineOptions
): LineupRecommendation {
  const { playerRoster, target } = extracted

  // Analyze defender composition
  const defenderAnalysis = analyzeDefenders(target.defenderUnits)

  // Select doctrine based on target type and defender composition
  const doctrine = selectDoctrine(target.type, defenderAnalysis, objective)

  // Build lineup based on doctrine
  const lineup = buildLineup(playerRoster, doctrine, cpLimit, options)

  // Generate wave plan
  const wavePlan = generateWavePlan(lineup, doctrine, target.type)

  // Calculate scores
  const score = calculateScore(lineup, wavePlan, objective, defenderAnalysis)
  const risk = calculateRisk(lineup, defenderAnalysis, target.type)

  // Generate explanation
  const explanation = generateExplanation(doctrine, defenderAnalysis, objective)

  // Calculate total CP
  const cpTotal = lineup.reduce((sum, unit) => {
    const stats = unitStats.find(u => u.unitKey === unit.unitKey)
    return sum + (stats?.apCost || 0) * unit.count
  }, 0)

  return {
    lineup,
    wavePlan,
    score,
    risk,
    explanation,
    cpTotal,
  }
}

/**
 * Analyze defender composition to determine threats
 */
interface DefenderAnalysis {
  infantryHeavy: boolean
  vehicleHeavy: boolean
  airPresent: boolean
  turretHeavy: boolean
  totalStrength: number
}

function analyzeDefenders(defenders: DefenderUnit[]): DefenderAnalysis {
  let infantryCount = 0
  let vehicleCount = 0
  let airCount = 0

  defenders.forEach(def => {
    const unit = unitStats.find(u => u.unitKey === def.unitKey)
    if (unit) {
      if (unit.type === 'infantry') infantryCount += def.count || 1
      if (unit.type === 'vehicle') vehicleCount += def.count || 1
      if (unit.type === 'air') airCount += def.count || 1
    }
  })

  const total = infantryCount + vehicleCount + airCount

  return {
    infantryHeavy: infantryCount > total * 0.5,
    vehicleHeavy: vehicleCount > total * 0.4,
    airPresent: airCount > 0,
    turretHeavy: false, // Will be determined from defense buildings
    totalStrength: total,
  }
}

/**
 * Doctrine defines the strategic approach
 */
interface Doctrine {
  name: string
  coreUnits: string[]
  supportUnits: string[]
  soakUnits: string[]
  priorities: string[]
}

function selectDoctrine(
  targetType: string,
  defenderAnalysis: DefenderAnalysis,
  objective: Objective
): Doctrine {
  // Anti-infantry doctrine (camp-ish)
  if (defenderAnalysis.infantryHeavy) {
    return {
      name: 'Anti-Infantry',
      coreUnits: ['nod_reckoner', 'nod_venom', 'gdi_orca'],
      supportUnits: ['nod_attack_bike', 'gdi_pitbull'],
      soakUnits: ['nod_militant', 'gdi_rifleman'],
      priorities: ['anti-infantry', 'speed', 'soak'],
    }
  }

  // Anti-vehicle doctrine
  if (defenderAnalysis.vehicleHeavy) {
    return {
      name: 'Anti-Vehicle',
      coreUnits: ['nod_rocket', 'gdi_missile', 'nod_scorpion', 'gdi_predator'],
      supportUnits: ['nod_attack_bike', 'gdi_pitbull'],
      soakUnits: ['nod_militant', 'gdi_rifleman'],
      priorities: ['anti-vehicle', 'range', 'armor'],
    }
  }

  // Base assault (structure-heavy)
  if (targetType === 'base' || defenderAnalysis.turretHeavy) {
    return {
      name: 'Base Assault',
      coreUnits: ['nod_vertigo', 'gdi_kodiak', 'nod_attack_bike'],
      supportUnits: ['nod_avatar', 'gdi_mammoth'],
      soakUnits: ['nod_militant', 'gdi_rifleman'],
      priorities: ['structure-damage', 'armor', 'range'],
    }
  }

  // Balanced/mixed doctrine (default)
  return {
    name: 'Balanced',
    coreUnits: ['nod_scorpion', 'gdi_predator', 'nod_rocket', 'gdi_missile'],
    supportUnits: ['nod_venom', 'gdi_orca'],
    soakUnits: ['nod_militant', 'gdi_rifleman'],
    priorities: ['flexibility', 'cost-efficiency'],
  }
}

/**
 * Build lineup from roster based on doctrine and constraints
 */
function buildLineup(
  roster: RosterUnit[],
  doctrine: Doctrine,
  cpLimit: number,
  options: EngineOptions
): LineupUnit[] {
  const lineup: LineupUnit[] = []
  let remainingCP = cpLimit

  // Helper to add units to lineup
  const addUnit = (unitKey: string, preferredCount: number = 2) => {
    const rosterUnit = roster.find(u => u.unitKey === unitKey)
    if (!rosterUnit) return false

    const stats = unitStats.find(u => u.unitKey === unitKey)
    if (!stats) return false

    const unitCP = stats.apCost
    const maxCount = Math.min(
      preferredCount,
      Math.floor(remainingCP / unitCP),
      rosterUnit.count || 999
    )

    if (maxCount > 0) {
      lineup.push({
        unitKey,
        desiredLevel: rosterUnit.level,
        count: maxCount,
      })
      remainingCP -= unitCP * maxCount
      return true
    }
    return false
  }

  // 1. Add soak units (1-2 units)
  const soakUnit = doctrine.soakUnits.find(key =>
    roster.some(r => r.unitKey === key)
  )
  if (soakUnit) addUnit(soakUnit, 2)

  // 2. Add core units (main damage dealers)
  for (const coreUnit of doctrine.coreUnits) {
    if (remainingCP < 50) break
    if (addUnit(coreUnit, 3)) {
      // Successfully added core unit
    }
  }

  // 3. Add support units
  for (const supportUnit of doctrine.supportUnits) {
    if (remainingCP < 30) break
    addUnit(supportUnit, 2)
  }

  // 4. Fill remaining CP with best available units
  const availableUnits = roster
    .filter(r => !lineup.some(l => l.unitKey === r.unitKey))
    .sort((a, b) => {
      const aStats = unitStats.find(u => u.unitKey === a.unitKey)
      const bStats = unitStats.find(u => u.unitKey === b.unitKey)
      return (bStats?.apCost || 0) - (aStats?.apCost || 0)
    })

  for (const unit of availableUnits) {
    if (remainingCP < 20) break
    addUnit(unit.unitKey, 1)
  }

  return lineup
}

/**
 * Generate wave plan based on lineup and doctrine
 */
function generateWavePlan(
  lineup: LineupUnit[],
  doctrine: Doctrine,
  targetType: string
): WavePlan[] {
  const waves: WavePlan[] = []

  // Wave 1: Soak units (cheap infantry)
  const soakUnits = lineup.filter(u =>
    doctrine.soakUnits.includes(u.unitKey)
  )
  if (soakUnits.length > 0) {
    waves.push({
      wave: 1,
      units: soakUnits,
      strategy: 'Send cheap infantry to absorb initial defenses and scout turret positions',
    })
  }

  // Wave 2: Main assault (core units)
  const coreUnits = lineup.filter(u =>
    doctrine.coreUnits.includes(u.unitKey)
  )
  if (coreUnits.length > 0) {
    waves.push({
      wave: 2,
      units: coreUnits,
      strategy: 'Main attack wave - focus fire on key defensive structures and units',
    })
  }

  // Wave 3: Support/cleanup
  const supportUnits = lineup.filter(u =>
    doctrine.supportUnits.includes(u.unitKey)
  )
  if (supportUnits.length > 0) {
    waves.push({
      wave: 3,
      units: supportUnits,
      strategy: 'Cleanup wave - eliminate remaining defenses and secure victory',
    })
  }

  // If no waves defined, create a single-wave plan
  if (waves.length === 0) {
    waves.push({
      wave: 1,
      units: lineup,
      strategy: 'Single wave assault - all units attack together',
    })
  }

  return waves
}

/**
 * Calculate lineup score based on objective
 */
function calculateScore(
  lineup: LineupUnit[],
  wavePlan: WavePlan[],
  objective: Objective,
  defenderAnalysis: DefenderAnalysis
): number {
  let score = 50 // Base score

  // Calculate total firepower
  const totalFirepower = lineup.reduce((sum, unit) => {
    const stats = unitStats.find(u => u.unitKey === unit.unitKey)
    return sum + (stats?.apCost || 0) * unit.count
  }, 0)

  // Adjust based on objective
  switch (objective) {
    case 'min_repair_time':
      // Favor cheaper units and soak
      score += lineup.filter(u =>
        u.unitKey.includes('militant') || u.unitKey.includes('rifleman')
      ).length * 10
      break

    case 'min_power_cost':
      // Similar to repair time
      score += lineup.filter(u =>
        u.unitKey.includes('militant') || u.unitKey.includes('rifleman')
      ).length * 10
      break

    case 'max_loot_per_minute':
      // Favor speed and firepower
      score += Math.min(totalFirepower / 10, 30)
      break

    case 'max_win_chance':
      // Favor total power
      score += Math.min(totalFirepower / 8, 40)
      break
  }

  // Bonus for good counter-composition
  lineup.forEach(unit => {
    const stats = unitStats.find(u => u.unitKey === unit.unitKey)
    if (stats) {
      if (defenderAnalysis.infantryHeavy && stats.damageVs?.infantry > 1.2) {
        score += 5
      }
      if (defenderAnalysis.vehicleHeavy && stats.damageVs?.vehicle > 1.2) {
        score += 5
      }
    }
  })

  return Math.min(Math.max(score, 0), 100)
}

/**
 * Calculate risk score (0-100, lower is better)
 */
function calculateRisk(
  lineup: LineupUnit[],
  defenderAnalysis: DefenderAnalysis,
  targetType: string
): number {
  let risk = 50 // Base risk

  // Increase risk for strong defenders
  risk += defenderAnalysis.totalStrength * 2

  // Decrease risk for larger armies
  const armySize = lineup.reduce((sum, u) => sum + u.count, 0)
  risk -= armySize * 2

  // Increase risk for base assaults
  if (targetType === 'base') risk += 20
  if (targetType === 'camp') risk -= 10

  return Math.min(Math.max(risk, 0), 100)
}

/**
 * Generate human-readable explanation
 */
function generateExplanation(
  doctrine: Doctrine,
  defenderAnalysis: DefenderAnalysis,
  objective: Objective
): string {
  const parts: string[] = []

  parts.push(`Using ${doctrine.name} doctrine.`)

  if (defenderAnalysis.infantryHeavy) {
    parts.push('Enemy has many infantry units - using anti-infantry counters.')
  }
  if (defenderAnalysis.vehicleHeavy) {
    parts.push('Enemy has heavy vehicles - deploying anti-vehicle units.')
  }

  switch (objective) {
    case 'min_repair_time':
      parts.push('Prioritizing cheap units to minimize repair time.')
      break
    case 'min_power_cost':
      parts.push('Optimizing for low power repair costs.')
      break
    case 'max_loot_per_minute':
      parts.push('Fast attack composition for maximum loot efficiency.')
      break
    case 'max_win_chance':
      parts.push('Maximum firepower for highest win probability.')
      break
  }

  return parts.join(' ')
}
