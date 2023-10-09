import axios from 'axios'

export async function sendMessageResponse(response_url: string, answer: any): Promise<any> {
  const { data } = await axios.post(response_url, answer)
  return data
}
