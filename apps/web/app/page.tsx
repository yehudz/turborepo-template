"use client"

import { useState } from "react"

// DS (Design System - UI package)
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui"

export default function Page() {
  const [clicked, setClicked] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Shadcn UI Test</CardTitle>
          <CardDescription>
            Testing the new Shadcn components in the monorepo
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button onClick={() => setClicked(!clicked)}>
            Click me
          </Button>
          {clicked && (
            <p className="text-muted-foreground">
              Button was clicked! 🎉
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
