import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignOutButton,
  useUser, 
  useAuth
} from '@clerk/clerk-react'

import { useState, useEffect } from 'react'
import { Wubbie } from './types'

export default function App() {
  const [rolled, setRolled] = useState<Wubbie | null>(null)
  const [wallet, setWallet] = useState<Wubbie[]>([])
  const { user } = useUser()             
  const userId = user?.id 
  const { getToken } = useAuth()

  async function loadWallet() {
    const token = await getToken()
    if (!userId) return
    try {
      const res = await fetch('/wallet', { headers: { 'Authorization': `Bearer ${token}` } })
      console.log(res)
      const json = await res.json()
      setWallet(json.wallet ?? [])
      
    } catch {
      setWallet([])
    }
  }

  async function doRoll() {
    const token = await getToken()
    if (!userId) return
    const res = await fetch('/roll', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: '{}'
    })
    const json = await res.json()
    setRolled(json.wubbie)
    loadWallet()
  }

  useEffect(() => {
    loadWallet()
  }, [userId])

  return (
    <div style={{ padding: 20 }}>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div style={{ marginBottom: 20 }}>
          <SignOutButton>
            <button>Sign Out</button>
          </SignOutButton>
        </div>

        <button onClick={doRoll} disabled={!userId}>
          Roll your Wubbie
        </button>

        {rolled && (
          <div style={{ marginTop: 10 }}>
            <h3>You got:</h3>
            <img src={rolled.imageUrl} alt={rolled.name} width={100} />
            <p>{rolled.name} ({rolled.rarity})</p>
          </div>
        )}

        <hr style={{ margin: '20px 0' }} />

        <h2>Your Collection</h2>
        {wallet.length === 0
          ? <p>Your collection is empty. Roll to get started!</p>
          : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {wallet.map(w => (
                <div key={w.id} style={{ textAlign: 'center' }}>
                  <img src={w.imageUrl} alt={w.name} width={60} />
                  <div>{w.name}</div>
                </div>
              ))}
            </div>
          )
        }
      </SignedIn>
    </div>
  )
}
