// First Load
import 'reflect-metadata';
require('dotenv').config();

// Next
import firebase from 'firebase';
import App from './app';
import { queue } from './services/Queue';

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
    var useCredential: firebase.auth.UserCredential;
    try {
        useCredential = await firebaseApp.auth().signInWithEmailAndPassword(firebaseAuth!.user, firebaseAuth!.pass);
        
    } catch(err) {
        console.log(`Unable to authenticate with Firebase: `);
        console.log(err);

        return;
    }

    setInterval(RefreshToken, 15 * 60 * 1000); // 15 minutes

    console.log(`[Index] Firebase logged in as ${useCredential.user!.email}`);
    queue.Connect(firebase.database());
   
    App.listen(process.env.APP_PORT_HTTP, () => {
        console.log(`[Index] App started on port ${process.env.APP_PORT_HTTP}`);
    });
}

const RefreshToken = () => {
    firebase.auth().currentUser!.getIdToken(true).then(function(idToken) {
        console.log(`[Firebase] Token is refreshed`);
    }).catch(function(error) {
        console.log(`[Firebase] Unable to refresh token`);
    });
}

AppStart();