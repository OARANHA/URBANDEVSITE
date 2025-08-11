import { config } from './config'

export class ZAIClient {
  private baseUrl: string
  private apiKey: string
  
  constructor() {
    this.baseUrl = config.zai.baseUrl
    this.apiKey = config.zai.apiKey
  }
  
  async chatCompletion(messages: Array<{role: string, content: string}>, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: config.zai.model,
          messages,
          ...options
        })
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('Z.ai API error response:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Z.ai API error:', error)
      throw error
    }
  }
  
  async generateImage(prompt: string, size = '1024x1024') {
    try {
      const response = await fetch(`${this.baseUrl}images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          size
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Z.ai image generation error:', error)
      throw error
    }
  }
}

export const zaiClient = new ZAIClient()