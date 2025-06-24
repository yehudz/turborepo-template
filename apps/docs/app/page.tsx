"use client"

import { useState } from "react"

export default function Page() {
  const [clicked, setClicked] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <button
          onClick={() => setClicked(!clicked)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Click me
        </button>
        {clicked && (
          <p className="mt-4 text-green-600">
            Button was clicked!
          </p>
        )}
      </div>
    </main>
  )
}
