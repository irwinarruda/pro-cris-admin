import { createSignal, createMemo, createContext, useContext, JSX, Accessor } from 'solid-js';
import { useLocation } from 'solid-start';
import { User } from '~/entities/User';
import { UserService } from '~/services/UserService';
import { removeLastSlash } from '~/utils/removeLastSlash';

export type SignInDTO = {
  email: string;
  password: string;
};

export type AuthContextProps = {
  user: Accessor<User | null>;
  isAuth: Accessor<boolean>;
  showSplash: Accessor<boolean>;
  shouldRedirect: Accessor<boolean>;
  redirectPath: Accessor<string>;
  signIn: (args: SignInDTO) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: ({ user }: { user: User }) => void;
};

const protectedRoutes = ['/admin'];

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider(props: { children: JSX.Element }) {
  const location = useLocation();
  const [showSplash, setShowSplash] = createSignal(true);
  const [user, setAuth] = createSignal<User | null>(null);
  const isAuth = createMemo(() => !!user());
  const shouldRedirect = createMemo(() => {
    if (isAuth() === !!protectedRoutes.find(route => route.startsWith(removeLastSlash(location.pathname)))) {
      return false;
    }
    return true;
  });
  const redirectPath = createMemo(() => {
    if (isAuth()) return '/admin';
    return '/admin/signin';
  });

  const value = {
    user,
    isAuth,
    showSplash,
    shouldRedirect,
    redirectPath,
    async signIn(args: SignInDTO) {
      const user = await UserService.signIn(args);
      setAuth(user);
    },
    async signOut() {
      await UserService.signOut();
      setAuth(null);
    },
    hydrate({ user }: { user: User }) {
      setAuth(user);
    },
  };

  UserService.onAuthStateChange(user => {
    setAuth(user);
    setShowSplash(false);
  });

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
