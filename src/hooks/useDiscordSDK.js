import { useState, useEffect } from 'react'

export function useDiscordSDK() {
  const [discordSdk, setDiscordSdk] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initDiscord = async () => {
      try {
        if (window.location.hostname === 'phystashka.github.io') {
          setIsAuthenticated(false)
          return
        }

        const { DiscordSDK } = await import('@discord/embedded-app-sdk')
        const sdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID)
        await sdk.ready()
        
        const { code } = await sdk.commands.authorize({
          client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
          response_type: 'code',
          state: '',
          prompt: 'none',
          scope: ['identify']
        })

        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        const { access_token } = await response.json()
        await sdk.commands.authenticate({ access_token })

        setDiscordSdk(sdk)
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(true)
      }
    }

    initDiscord()
  }, [])

  return { discordSdk, isAuthenticated }
}