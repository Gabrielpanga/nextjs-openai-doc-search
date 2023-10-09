import { sendMessageResponse } from '@/lib/modules/slack/utils'
import { getResponse } from '@/lib/query'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return new Error('Method not allowed')
  }
  const { response_url, question } = await req.body

  const response = await getResponse(question)
  const result = await response.text()
  console.log('Result: ', result)
  await sendMessageResponse(response_url || '', {
    text: `Here is what i found: \n\n ${result}`,
  })

  return res.status(200).json({ result })
}
