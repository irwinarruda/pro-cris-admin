import { Outlet, Navigate } from 'solid-start';
import { ProCrisSplash } from '~/components/templates/ProCrisSplash';
import { AppointmentProvider } from '~/providers/Appointment';
import { AuthProvider, useAuth } from '~/providers/Auth';
import { StudentProvider } from '~/providers/Student';

export default function AdminLayout() {
  return (
    <AuthProvider>
      <StudentProvider>
        <AppointmentProvider>
          <AdminLayoutUI />
        </AppointmentProvider>
      </StudentProvider>
    </AuthProvider>
  );
}

function AdminLayoutUI() {
  const { showSplash, shouldRedirect, redirectPath } = useAuth();
  return (
    <>
      {showSplash() && <ProCrisSplash />}
      {!showSplash() &&
        (shouldRedirect() ? (
          <Navigate href={redirectPath()} />
        ) : (
          <main class="w-full h-screen bg-purple-50">
            <Outlet />
          </main>
        ))}
    </>
  );
}
