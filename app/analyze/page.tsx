'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Objective } from '@/types'
import Link from 'next/link'

export default function AnalyzePage() {
  const router = useRouter()
  const [objective, setObjective] = useState<Objective>('max_win_chance')
  const [rosterImage, setRosterImage] = useState<File | null>(null)
  const [targetImage, setTargetImage] = useState<File | null>(null)
  const [defendersImage, setDefendersImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setter(file)
    }
  }

  const handleSubmit = async () => {
    if (!rosterImage || !targetImage) {
      alert('Please upload at least roster and target screenshots')
      return
    }

    setLoading(true)

    try {
      // For now, navigate to a demo results page
      // In production, this would upload images and call the API
      router.push('/results/demo')
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">New Analysis</CardTitle>
              <CardDescription>
                Upload screenshots and select your objective to get optimized lineup recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Objective Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Objective</Label>
                <RadioGroup value={objective} onValueChange={(val) => setObjective(val as Objective)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="max_win_chance" />
                    <Label className="font-normal cursor-pointer">
                      <span className="font-semibold">Maximum Win Chance</span> - Most powerful lineup
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="min_repair_time" />
                    <Label className="font-normal cursor-pointer">
                      <span className="font-semibold">Minimum Repair Time</span> - Fastest recovery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="min_power_cost" />
                    <Label className="font-normal cursor-pointer">
                      <span className="font-semibold">Minimum Power Cost</span> - Lowest power consumption
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="max_loot_per_minute" />
                    <Label className="font-normal cursor-pointer">
                      <span className="font-semibold">Maximum Loot/Minute</span> - Best efficiency
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Image Uploads */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roster" className="text-base font-semibold">
                    Your Units (Required) *
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Screenshot of your available units with levels visible
                  </p>
                  <input
                    id="roster"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setRosterImage)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {rosterImage && (
                    <p className="text-sm text-green-600">✓ {rosterImage.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target" className="text-base font-semibold">
                    Enemy Base Layout (Required) *
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Screenshot of enemy base showing buildings and defenses
                  </p>
                  <input
                    id="target"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setTargetImage)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {targetImage && (
                    <p className="text-sm text-green-600">✓ {targetImage.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defenders" className="text-base font-semibold">
                    Enemy Units (Optional)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Screenshot showing defender units and levels (if visible)
                  </p>
                  <input
                    id="defenders"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setDefendersImage)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {defendersImage && (
                    <p className="text-sm text-green-600">✓ {defendersImage.name}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!rosterImage || !targetImage || loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze & Get Recommendations'}
                </Button>
              </div>

              {/* Help Text */}
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-semibold mb-2">Tips for best results:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Take clear screenshots with units and levels visible</li>
                  <li>Ensure good lighting and contrast</li>
                  <li>Include as much information as possible</li>
                  <li>You can correct extracted data in the next step</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
