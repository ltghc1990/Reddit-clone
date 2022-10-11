/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyCBUm4Az34fPcxVM_SpHJmLpW7kONOkqPM",
      authDomain: "reddit-clone-tutorial-65ce9.firebaseapp.com",
      projectId: "reddit-clone-tutorial-65ce9",
      storageBucket: "reddit-clone-tutorial-65ce9.appspot.com",
      messagingSenderId: "246917572172",
      appId: "1:246917572172:web:0c5997914baa4f1fa7f6e9",
    },
  },
};

module.exports = nextConfig;
