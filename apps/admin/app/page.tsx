"use client"

import { useState } from "react"

export default function Page() {
  const [clicked, setClicked] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-96 rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Admin Panel</h3>
          <p className="text-sm text-muted-foreground">
            Simple admin interface for the turborepo template
          </p>
        </div>
        <div className="p-6 pt-0 text-center space-y-4">
          <button
            onClick={() => setClicked(!clicked)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Admin Action
          </button>
          {clicked && (
            <p className="text-muted-foreground">
              Admin button was clicked! ⚡
            </p>
          )}
        </div>
      </div>
    </main>
  )
}