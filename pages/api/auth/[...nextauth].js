import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialProvider from "next-auth/providers/credentials"
import jwtDecode from "jwt-decode"

export default NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const payload = {
          email: credentials.email,
          password: credentials.password,
        }

        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        })

        const user = await res.json()

        if (!res.ok) {
          throw new Error(user.exception)
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          console.log("user accessToken", user.accessToken)

          const decoded = jwtDecode(user.accessToken)
          const { email, roles } = decoded ? decoded.UserInfo : null
          console.log("email at session", email)
          console.log("roles at session", roles)

          return { email, roles }
        } else {
          return null
        }
      },
    }),
  ],
})
