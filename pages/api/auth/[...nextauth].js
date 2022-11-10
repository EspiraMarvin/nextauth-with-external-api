import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialProvider from "next-auth/providers/credentials"

let access_token_temp = null
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
          console.log("user", user)
          access_token_temp = res

          return res
        } else {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ access_token_temp: token }) {
      console.log("token, user at callbacks", token)
      // console.log("token, user email ", token.email)

      // console.log(" user ", user)
      // console.log("account", account)

      // if (account && user) {
      //   return {
      //     ...token,
      //     accessToken: user.access_token,
      //     refreshToken: user.refresh_token,
      //   }
      // }
      // console.log("THIS TOKEN", token)
      return token
    },

    async session({ session, token }) {
      console.log("session at async session", session)
      console.log("token at async session", token)

      session.user.access_token = access_token_temp

      // session.user.access_token = access_token_temp
      // session.user.access_token = token.jti

      return session
    },
  },
})
