import { getBaseUrl } from '@/lib/utils'
import axios from 'axios'

export async function sendMessageResponse(response_url: string, answer: any): Promise<any> {
  const { data } = await axios.post(response_url, answer)
  return data
}

export async function enqueueJob(
  type: string,
  question: string,
  response_url: string
): Promise<any> {
  const url = `${getBaseUrl()}/api/slack/job`
  console.log('Sending job to queue: ', url)
  const { data } = await axios.post(url, {
    type,
    question,
    response_url,
  })
  return data
}
