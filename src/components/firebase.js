import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

export const auth = firebase.auth()
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const storage = firebase.storage()
export const db = firebase.firestore()