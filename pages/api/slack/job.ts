import { sendMessageResponse } from '@/lib/modules/slack/utils'
import { getResponse } from '@/lib/query'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return new Error('Method not allowed')
    }
    const { response_url, question } = await req.body

    if (!question) {
      return res.status(400).json({ error: 'Missing question' })
    }

    if (!response_url) {
      return res.status(400).json({ error: 'Missing response_url' })
    }

    console.log(`Received question: ${question}, starting to process`)
    getResponse(question).then(async (response) => {
      const result = await response.text()
      console.log('Result: ', result)
      await sendMessageResponse(response_url || '', {
        text: `Here is what i found: \n\n ${result}`,
      })
    })

    return res.status(200).json({ message: 'Job sent to queue' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
