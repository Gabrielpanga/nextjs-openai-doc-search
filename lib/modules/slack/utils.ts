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
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/slack/job`, {
    type,
    question,
    response_url,
  })
  return data
}
