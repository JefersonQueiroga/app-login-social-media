import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const oauthConfig = {
  google: {
    webClientId: "552902445829-qshqm3h10t7d0e729tn226ue2o70a9ih.apps.googleusercontent.com",
  },
  github: {
    clientId: "Ov23liC3fl7JaE3aoTIb",
    clientSecret: "3a3c8b3a0bb1a93e0b562fd41c42a4690bcc2e6a",
  },
};