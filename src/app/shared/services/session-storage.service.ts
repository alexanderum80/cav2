import { Injectable } from '@angular/core';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  get userToken(): Session {
    let userToken: Session = new Session();
    try {
      const tokenString = sessionStorage.getItem('token');
      if (tokenString) {
        userToken = JSON.parse(tokenString);
      }
    } catch (err) {
      return userToken;
    }
    return userToken;
  }

  getSession(sessionName: string) {
    let session: any;
    try {
      const sessionString = sessionStorage.getItem(sessionName);
      if (sessionString) {
        session = JSON.parse(sessionString);
      }
    } catch (err) {
      return session;
    }
    return session;
  }

  createSession(sessionName: string, session: any) {
    if (session) {
      sessionStorage.setItem(sessionName, JSON.stringify(session));
    }
  }

  removeSession(sessionName: string) {
    sessionStorage.removeItem(sessionName);
  }
}
