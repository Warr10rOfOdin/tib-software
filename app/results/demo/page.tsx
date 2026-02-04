'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { generateRecommendations } from '@/lib/engine/recommendation-engine'
import { ExtractedData } from '@/types'
import { getUnitByKey } from '@/lib/unit-stats'

// Demo data
const demoExtractedData: ExtractedData = {
  playerRoster: [
    { unitKey: 'nod_militant', level: 50, count: 10 },
    { unitKey: 'nod_rocket', level: 48, count: 8 },
    { unitKey: 'nod_scorpion', level: 52, count: 6 },
    { unitKey: 'nod_attack_bike', level: 49, count: 5 },
    { unitKey: 'nod_venom', level: 51, count: 4 },
    { unitKey: 'nod_reckoner', level: 50, count: 3 },
  ],
  target: {
    type: 'outpost',
    level: 45,
    defenderUnits: [
      { unitKey: 'nod_militant', level: 42, count: 5 },
      { unitKey: 'nod_rocket', level: 40, count: 3 },
      { unitKey: 'nod_scorpion', level: 43, count: 2 },
    ],
    defenseBuildings: [
      { buildingKey: 'nod_defense_facility', level: 45 },
    ],
  },
}

export default function DemoResultsPage() {
  const recommendations = generateRecommendations(demoExtractedData, 'max_win_chance')
  const { top, alternatives } = recommendations

  const renderLineupUnit = (unit: any) => {
    const stats = getUnitByKey(unit.unitKey)
    return (
      <div key={unit.unitKey} className="flex items-center justify-between p-3 bg-muted rounded-md">
        <div>
          <p className="font-semibold">{stats?.name || unit.unitKey}</p>
          <p className="text-sm text-muted-foreground">
            Level {unit.desiredLevel} × {unit.count}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{(stats?.apCost || 0) * unit.count} CP</p>
          <p className="text-xs text-muted-foreground">{stats?.type}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/analyze">
            <Button variant="ghost">← New Analysis</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-3xl">Analysis Results</CardTitle>
              <CardDescription>
                Target: {demoExtractedData.target.type} (Level {demoExtractedData.target.level})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-600">{top.score}</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{top.risk}</p>
                  <p className="text-sm text-muted-foreground">Risk</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{top.cpTotal}</p>
                  <p className="text-sm text-muted-foreground">Total CP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Lineup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Recommended Lineup</CardTitle>
              <CardDescription>{top.explanation}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {top.lineup.map(renderLineupUnit)}
            </CardContent>
          </Card>

          {/* Wave Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Wave Plan</CardTitle>
              <CardDescription>Strategic deployment guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {top.wavePlan.map((wave) => (
                <div key={wave.wave} className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg mb-2">Wave {wave.wave}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{wave.strategy}</p>
                  <div className="space-y-2">
                    {wave.units.map((unit) => {
                      const stats = getUnitByKey(unit.unitKey)
                      return (
                        <div key={unit.unitKey} className="text-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span>{stats?.name || unit.unitKey} ×{unit.count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alternative Lineups */}
          {alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Alternative Lineups</CardTitle>
                <CardDescription>Other viable strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Alternative {idx + 1}</h3>
                      <div className="flex gap-4 text-sm">
                        <span>Score: {alt.score}</span>
                        <span>Risk: {alt.risk}</span>
                        <span>CP: {alt.cpTotal}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{alt.explanation}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {alt.lineup.slice(0, 4).map((unit) => {
                        const stats = getUnitByKey(unit.unitKey)
                        return (
                          <div key={unit.unitKey} className="text-sm p-2 bg-muted rounded">
                            {stats?.name || unit.unitKey} ×{unit.count}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg">
                  Save as Preset
                </Button>
                <Button variant="outline" size="lg">
                  Upload Battle Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
