import { useState, useEffect } from 'react'

export function useDiscordSDK() {
  const [discordSdk, setDiscordSdk] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isInDiscord, setIsInDiscord] = useState(false)

  useEffect(() => {
    console.log('useDiscordSDK: Starting initialization...')
    
    const initializeSDK = async () => {
      try {
        const inDiscord = window.parent !== window || 
                         window.location.href.includes('discord.com') ||
                         window.location.search.includes('frame_id')
        
        console.log('useDiscordSDK: inDiscord check:', inDiscord)
        setIsInDiscord(inDiscord)
        
        if (!inDiscord) {
          console.log('Not in Discord iframe - running in web mode')
          setIsAuthenticated(true) 
          return
        }

        console.log('useDiscordSDK: Checking for Discord SDK...')
        if (typeof window.DiscordSDK === 'undefined') {
          console.log('Discord SDK not loaded, but continuing...')
          setIsAuthenticated(true)
          return
        }

        console.log('Initializing Discord SDK...')

        const sdk = new window.DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID || '1302358354766348349')

        await sdk.ready()
        
        console.log('Discord SDK ready!')
        setDiscordSdk(sdk)
        setIsAuthenticated(true)
        
        try {
          await sdk.commands.authorize({
            client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || '1410749389386940537',
            response_type: 'code',
            state: '',
            prompt: 'none',
            scope: ['identify']
          })
          
          console.log('Discord authentication completed')
        } catch (authError) {
          console.log('Authentication skipped, continuing without it')
        }
        
      } catch (error) {
        console.error('Discord SDK error:', error)
        setIsAuthenticated(true)
      }
    }

    console.log('useDiscordSDK: Setting timer for initialization...')
    const timer = setTimeout(() => {
      console.log('useDiscordSDK: Timer fired, calling initializeSDK')
      initializeSDK()
    }, 200)
    
    return () => {
      console.log('useDiscordSDK: Cleanup, clearing timer')
      clearTimeout(timer)
    }
  }, [])

  return { 
    discordSdk, 
    isAuthenticated, 
    isInDiscord 
  }
}