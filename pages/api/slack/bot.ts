import { sendMessageResponse } from '@/lib/modules/slack/utils'
import { getResponse } from '@/lib/query'
import { NextApiRequest, NextApiResponse } from 'next'

export const HELP_RESPONSE_PAYLOAD = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Hey! Im Morai, a knowledge bot, that will help you with any doubt or problem you may face.*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'You can use the following commands:',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*General Commands*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*`/morai ask [question]`* - Ask your question to MoraiDB. \n',
      },
    },
  ],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return new Error('Method not allowed')
  }

  console.log(req)
  const requestData = await req.body

  //   const text = requestData.get('text')?.toString()
  //   const response_url = requestData.get('response_url')?.toString()
  const { text, response_url } = requestData
  const [command, ...params] = text?.split(' ') || []
  switch (command) {
    case 'ask':
      const question = params.join(' ')

      getResponse(question).then(async (res) => {
        const result = await res.text()
        console.log('Result: ', result)
        await sendMessageResponse(response_url || '', {
          text: `Here is what i found: \n\n ${result}`,
        })
      })

      return res.status(200).json({
        text: `Great, i got your question _"${question}"_ :smile: ! Will get back to you in a minute.`,
        response_type: 'ephemeral',
      })
    case '':
    case 'help':
      return new Response(JSON.stringify(HELP_RESPONSE_PAYLOAD), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
  }

  return res.status(200).json({
    text: 'Wow, im not sure what is that command :smile:',
    response_type: 'ephemeral',
  })
}
