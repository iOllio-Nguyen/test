import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import mongodb from 'mongodb'
// import bcrypt from 'bcrypt';

const options = {
    session: {
        jwt: true,
        maxAge: 24 * 60 * 60 // 1 day
    }, 
    pages: {
      // signIn: '/signup',
      // signOut: '/auth/signout',
      // error: '../../', // Error code passed in query string as ?error=
      // verifyRequest: '../../?emailSignin=verified' // (used for check email message)
      // newUser: '/signup' // If set, new users will be directed here on first sign in
    },
    callbacks: {
      /**
       * @param  {object} user     User object
       * @param  {object} account  Provider account
       * @param  {object} profile  Provider profile 
       * @return {boolean|string}  Return `true` to allow sign in
       *                           Return `false` to deny access
       *                           Return `string` to redirect to (eg.: "/unauthorized")
       */
      async signIn(user, account, profile) {
        const isAllowedToSignIn = true
        if (isAllowedToSignIn) {
          return true
          
        } else {
          return false
          // Or you can return a URL to redirect to:
          // return '/unauthorized'
        }
      },
      /**
       * @param  {string} url      URL provided as callback URL by the client
       * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
       * @return {string}          URL the client will be redirect to
       */
      async redirect(url, baseUrl) {
        // return url.startsWith(baseUrl)
        // ? Promise.resolve(url)
        // : Promise.resolve(baseUrl)
        return url
      }
    },
    events: {
      async signIn(message) {
        const email = message.user.email
        const getConnection =()=>{
          return mongodb.connect(process.env.DATABASE_URL, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
          })
        }

        getConnection().then(connection => connection.db('xshop').collection('userProfile').findOne({email: email})
        .then(credentical => { 
          if(!credentical){
            const currentDate = new Date().toLocaleString().split(',')
            const currentDateTime = currentDate[0]+" "+new Date().toTimeString()    
           
            const profile = {
              email: email,
              phoneNumber: '',
              address: '',
              fullName:'',
              itemBrought: '',
              dateCreated: currentDateTime
            }

            connection.db('xshop').collection('userProfile')
            .insertOne(profile, (err,res)=> connection.close())
          }  
          else{
            connection.close()
          }  
      }))
    },
      async signOut(message) { /* on signout */ },
      async createUser(message) { /* user created */ },
      async linkAccount(message) { /* account linked to a user */ },
      async session(message) { /* session is active */ },
      async error(message) { /* error in authentication flow */ }
    },
    providers: [
      Providers.Email({
        server: process.env.MAIL_SERVER,
        from: 'NextAuth.js <no-reply@example.com>'
      }),
      Providers.Google({
        clientId: "689214693079-if736i9hqleu4j2l6v14eld92gek87tb.apps.googleusercontent.com",
        clientSecret: "n-9IiVeTuLr6dukOcFcx55Ee",
      }),
  ],

  site: process.env.NEXTAUTH_URL,
  // database: process.env.DATABASE_URL
}
 
export default async(req, res) => {
  await NextAuth(req, res, options)
}