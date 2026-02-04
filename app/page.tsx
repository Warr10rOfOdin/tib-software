import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
            CnC: Tiberium Alliances
          </h1>
          <h2 className="text-3xl font-semibold mb-6">
            Lineup Optimizer
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload screenshots of your units and enemy defenses to get optimal attack lineups and wave plans
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚔️</span>
                New Analysis
              </CardTitle>
              <CardDescription>
                Upload screenshots and get recommended attack lineups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/analyze">
                <Button size="lg" className="w-full">
                  Start New Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View your past analyses and battle reports
                </p>
                <Link href="/history">
                  <Button variant="outline" className="w-full">
                    View History
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💾 Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your saved lineup presets
                </p>
                <Link href="/presets">
                  <Button variant="outline" className="w-full">
                    Manage Presets
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📚 Unit Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse unit statistics and attributes
                </p>
                <Link href="/units">
                  <Button variant="outline" className="w-full">
                    View Units
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-3">
                <span className="text-xl font-bold text-primary">1.</span>
                <p>Upload screenshots of your available units and enemy defenses</p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl font-bold text-primary">2.</span>
                <p>Choose your objective (min repair time, max loot, etc.)</p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl font-bold text-primary">3.</span>
                <p>Get AI-powered lineup recommendations with wave plans</p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl font-bold text-primary">4.</span>
                <p>Upload battle reports to improve future recommendations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
