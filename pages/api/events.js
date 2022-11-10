import axios from "axios"

export default async function handler(req, res) {
  try {
    let endpoint = `http://localhost:${process.env.NEXT_PORT}/api/events`
    //   let config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${process.env.NEXT_MEETUP_API_KEY}`,
    //     },
    //   }
    const events = (await axios.get(endpoint)).data
    // console.log("users req headers", events)
    res.status(200).json(events)
  } catch (error) {
    res.status(401).json(error.response?.data?.message)
  }
}
