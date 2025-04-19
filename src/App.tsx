import { useState, useEffect } from 'react'
import { Wubbie } from './types'

export default function App() {
  const [rolled, setRolled] = useState<Wubbie | null>(null)
  const [wallet, setWallet] = useState<Wubbie[]>([])

  async function loadWallet() {
    const res = await fetch('/wallet')
    const json = await res.json()
    setWallet(json.wallet)
  }

  async function doRoll() {
    const res = await fetch('/roll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}' 
    })
    const json = await res.json()
    setRolled(json.wubbie)
    loadWallet()
  }

  useEffect(() => {
    loadWallet()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <button onClick={doRoll}>Roll your Wubbie</button>
      {rolled && (
        <div style={{ marginTop: 10 }}>
          <h3>You got:</h3>
          <img src={rolled.imageUrl} alt={rolled.name} width={100} />
          <p>{rolled.name} ({rolled.rarity})</p>
        </div>
      )}
      <hr style={{ margin: '20px 0' }} />
      <h2>Your Collection</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {wallet.map(w => (
          <div key={w.id} style={{ textAlign: 'center' }}>
            <img src={w.imageUrl} alt={w.name} width={60} />
            <div>{w.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
