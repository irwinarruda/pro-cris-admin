import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { User } from '~/entities/User';

import { auth } from './firebaseConfig';

type SignInReq = {
  email: string;
  password: string;
};

export class UserService {
  public static async signIn({ email, password }: SignInReq): Promise<User> {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: userCredentials.user.uid,
      name: userCredentials.user.displayName,
      avatar: userCredentials.user.photoURL,
      email: userCredentials.user.email!,
      phone: userCredentials.user.phoneNumber,
    };
  }

  public static async signOut(): Promise<void> {
    await signOut(auth);
  }

  public static getCurrentUser(): User | null {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    return {
      id: currentUser.uid,
      name: currentUser.displayName,
      avatar: currentUser.photoURL,
      email: currentUser.email!,
      phone: currentUser.phoneNumber,
    };
  }

  public static onAuthStateChange(callback: (data: User | null) => void) {
    auth.onAuthStateChanged(user =>
      callback(
        !!user
          ? {
              id: user.uid,
              name: user.displayName,
              avatar: user.photoURL,
              email: user.email!,
              phone: user.phoneNumber,
            }
          : null,
      ),
    );
  }
}
