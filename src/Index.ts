require('dotenv').config();
import firebase from 'firebase';
import App from './App';

const firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    appId: process.env.FB_APPID,
    projectId: process.env.FB_PROJECTID,
    authDomain: process.env.FB_AUTHDOMAIN,
    databaseURL: process.env.FB_DBURL
}

const firebaseAuth = {
    user: process.env.FB_AUTH_USER!,
    pass: process.env.FB_AUTH_PASS!
}

const AppStart = async () => {
    // Firebase Authentication
    const firebaseApp = firebase.initializeApp(firebaseConfig);

    try {
        const useCredential: firebase.auth.UserCredential = await firebaseApp.auth().signInWithEmailAndPassword(firebaseAuth!.user, firebaseAuth!.pass);
    } catch(err) {
        console.log(`Unable to authenticate with Firebase: `);
        console.log(err);

        return;
    }
    console.log(`[Index] Firebase logged in as ${firebaseAuth.user}`);
   
    App.listen(process.env.APP_PORT_HTTP, () => {
        console.log(`[Index] App started on port ${process.env.APP_PORT_HTTP}`);
    });
}

AppStart();