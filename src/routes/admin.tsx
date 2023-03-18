import { Outlet, Navigate } from 'solid-start';
import { ProCrisSplash } from '~/components/templates/ProCrisSplash';
import { AuthProvider, useAuth } from '~/providers/Auth';

export default function AdminLayout() {
  return (
    <AuthProvider>
      <AdminLayoutUI />
    </AuthProvider>
  );
}

function AdminLayoutUI() {
  const { showSplash, isAuth, shouldRedirect, redirectPath } = useAuth();
  return (
    <>
      {showSplash() && <ProCrisSplash />}
      {!showSplash() &&
        (shouldRedirect(isAuth()) ? (
          <Navigate href={redirectPath(isAuth())} />
        ) : (
          <main class="w-full h-screen bg-purple-50">
            <Outlet />
          </main>
        ))}
    </>
  );
}
