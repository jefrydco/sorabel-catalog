import firebase from 'firebase/app'
import 'firebase/auth'

export const auth = firebase.auth()
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()