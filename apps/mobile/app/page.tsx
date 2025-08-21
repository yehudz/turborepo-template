"use client"

import { useState } from "react"

// DS (Design System - UI package)
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui"

export default function Page() {
  const [clicked, setClicked] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>📱 Mobile App</CardTitle>
          <CardDescription>
            Next.js + Capacitor + Shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button 
            onClick={() => setClicked(!clicked)}
            className="w-full py-3 text-lg"
            size="lg"
          >
            Tap me
          </Button>
          {clicked && (
            <p className="text-muted-foreground">
              Mobile app working! 🚀
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
