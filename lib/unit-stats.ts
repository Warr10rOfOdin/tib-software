import { UnitStats } from '@/types'
import unitStatsData from '@/data/unit_stats.seed.json'

export function getUnitStats(): UnitStats[] {
  return unitStatsData.units as UnitStats[]
}

export function getUnitByKey(unitKey: string): UnitStats | undefined {
  return unitStatsData.units.find((u: any) => u.unitKey === unitKey) as UnitStats | undefined
}

export function getUnitsByFaction(faction: string): UnitStats[] {
  return unitStatsData.units.filter((u: any) => u.faction === faction) as UnitStats[]
}

export function getUnitsByType(type: string): UnitStats[] {
  return unitStatsData.units.filter((u: any) => u.type === type) as UnitStats[]
}
