import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUnitStats } from '@/lib/unit-stats'

export default function UnitsPage() {
  const units = getUnitStats()

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Unit Database</CardTitle>
              <CardDescription>
                Browse unit statistics and attributes
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => (
              <Card key={unit.unitKey}>
                <CardHeader>
                  <CardTitle className="text-lg">{unit.name}</CardTitle>
                  <CardDescription className="capitalize">
                    {unit.faction} • {unit.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">AP Cost</p>
                      <p className="font-semibold">{unit.apCost}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Armor</p>
                      <p className="font-semibold capitalize">{unit.armorType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Range</p>
                      <p className="font-semibold">{unit.range}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Speed</p>
                      <p className="font-semibold">{unit.speed}</p>
                    </div>
                  </div>

                  {unit.damageVs && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Damage vs:</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <span>Infantry: {(unit.damageVs.infantry * 100).toFixed(0)}%</span>
                        <span>Vehicle: {(unit.damageVs.vehicle * 100).toFixed(0)}%</span>
                        <span>Structure: {(unit.damageVs.structure * 100).toFixed(0)}%</span>
                        <span>Air: {(unit.damageVs.air * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
