export default async function handler(req, res) {
  console.log("req at auth singup", req)
  console.log("res at auth singup", res)

  res.json({ message: "signup" })
}
