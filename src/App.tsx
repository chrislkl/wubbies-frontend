import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignOutButton,
  useUser, 
  useAuth
} from '@clerk/clerk-react'
import './App.css'
import { useState, useEffect } from 'react'
import { Wubbie } from './types'

export default function App() {
  const [rolled, setRolled] = useState<Wubbie | null>(null)
  const [wallet, setWallet] = useState<Wubbie[]>([])
  const [isFading, setIsFading] = useState(false)
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const { user } = useUser()             
  const userId = user?.id 
  const { getToken } = useAuth()

  const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://wubbies-backend.onrender.com";

  async function loadWallet() {
    const token = await getToken()
    if (!userId) return
    try {
      const res = await fetch(`${API_BASE}/wallet`, { headers: { 'Authorization': `Bearer ${token}` } })
      console.log(res)
      const json = await res.json()
      setWallet(json.wallet ?? [])
      
    } catch {
      setWallet([])
    }
  }

  async function doRoll() {
    const token = await getToken()

    setIsFading(true)
    await new Promise(res => setTimeout(res, 400))

    const res = await fetch(`${API_BASE}/roll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: '{}'
    })
    const json = await res.json()
    setRolled(json.wubbie)
    setIsFading(false)
    if (userId) {
      loadWallet()
    } else {
      setWallet(prev => [...prev, json.wubbie])  // Temp guest wallet
    }
  }

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch(`${API_BASE}/`);
        if (!res.ok) throw new Error('Not OK');
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    }
  
    checkBackend();
  }, []);  

  useEffect(() => {
    if (userId) {
      loadWallet()
    }
  }, [userId])

  function getRarityStars(rarity: string): number {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 5
      case 'epic': return 4
      case 'rare': return 3
      case 'uncommon': return 2
      case 'common': return 1
      default: return 0
    }
  }
  

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Wubbies</h1>
        <SignedIn>
          <div className="signout-container">
            <SignOutButton>
              <button>Sign Out</button>
            </SignOutButton>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="signin-container">
            <SignInButton mode="modal">
              <button>Sign In</button>
            </SignInButton>
          </div>
        </SignedOut>
      </header>
      {backendOnline === false && (
        <div style={{ 
          color: 'white', 
          backgroundColor: 'rgba(255, 0, 0, 0.2)', 
          padding: '1rem', 
          marginBottom: '1rem', 
          borderRadius: '8px', 
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          The Wubbies server is starting up. Please wait ~1 minute, reload and try again!
        </div>
      )}
      
        <div className="box-container">
          <div className="roll-button">
            <img
              src="/images/wubbie-capsule.png"
              alt="Roll your Wubbie"
              onClick={backendOnline === false ? undefined : doRoll}
              className={`roll-image ${backendOnline === false ? 'disabled' : ''}`}
            />
            <div className="roll-button-desc">
              <p> Click to Unbox </p>
            </div>
          </div>

          {isFading && (
            <div className="rolling-overlay">
              <p>Unboxing...</p>
            </div>
          )}
          <div className={`rolled-container ${rolled && !isFading ? 'fade-in' : 'fade-out'}`}>
            {rolled && (
              <>
                <img
                  className="rolled-image"
                  src={`${API_BASE}${rolled.imageUrl}`}
                  alt={rolled.name}
                />
                <div className="rolled-info">
                  <p>{rolled.name} ({rolled.rarity})</p>
                </div>
              </>
            )}
          </div>
        </div>
  
        <hr className="divider" />
        
        <h2 style={{ 
          color: 'white', 
          textShadow: '1px 1px 3px rgba(0, 0, 0, 5)' 
        }}>
          Wubbie Wallet
        </h2>
        {wallet.length === 0
          ? <p style={{ 
            color: 'white', 
            textShadow: '1px 1px 3px rgba(0, 0, 0, 5)' 
          }} >Your wallet is empty. Unbox a wubbie to get started!</p>
          : (
            <div className="wallet-container">
              {wallet.map(w => (
                <div key={w.id} 
                  className="wallet-item"
                  data-rarity={w.rarity.toLowerCase()}>
                  <img src={`${API_BASE}${w.imageUrl}`} alt={w.name} />
                  <div className="rarity-stars">
                    {Array(getRarityStars(w.rarity)).fill('⭐').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <div>{w.name}</div>
                </div>
              ))}
            </div>
          )
        }
        {!userId && (
          <div style={{ 
            marginTop: '1rem', 
            color: 'white', 
            textShadow: '1px 1px 3px rgba(0,0,0,5)' 
          }}>
            <p>You’re currently playing as a guest!!! Sign in to save your Wubbies permanently!</p>
          </div>
        )}
        <footer className="app-footer">
          <p>
            <a href="https://read.cv/chrislew" target="_blank" rel="noreferrer">
              Read.cv
            </a>
            <span> | </span>
            <a href="https://www.linkedin.com/in/christopher-lew-kew-lin/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <span> | </span>
            <a href="https://github.com/chrislkl" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </p>
        </footer>

    </div>
  )  
}
