import express from 'express'

const app = express()
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`api running in port ${PORT}`)
})
