import { getBaseUrl } from '@/lib/utils'
import axios from 'axios'

export async function sendMessageResponse(response_url: string, answer: any): Promise<any> {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(answer),
    redirect: 'follow',
    headers: headers,
  }

  await fetch(response_url, requestOptions as any)
}

export async function enqueueJob(
  type: string,
  question: string,
  response_url: string
): Promise<any> {
  const url = `${getBaseUrl()}/api/slack/job`
  console.log('Sending job to queue: ', url)
  try {
    const { data } = await axios.post(
      url,
      {
        type,
        question,
        response_url,
      },
      {
        timeout: 1_500,
      }
    )

    console.log('Job sent to queue: ', data)
    return data
  } catch (error) {
    console.error('Error sending job to queue: ', error)
    return
  }
}
