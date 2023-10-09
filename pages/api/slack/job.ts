import { sendMessageResponse } from '@/lib/modules/slack/utils'
import { getResponse } from '@/lib/query'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return new Error('Method not allowed')
    }
    const { response_url, question } = await req.json()

    if (!question || !response_url) {
      return new Response(
        JSON.stringify({
          message: 'Missing question or response_url',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Received question: ${question}, starting to process, and reply to ${response_url}`)

    const response = await getResponse(question)
    const result = await response.text()
    console.log('Result: ', result)
    await sendMessageResponse(response_url || '', {
      text: `Here is what i found: \n\n ${result}`,
    })

    return new Response(
      JSON.stringify({
        message: 'Job sent to queue',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
