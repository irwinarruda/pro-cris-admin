import { A } from 'solid-start';
import { Button } from '~/components/atoms/Button';
import { ProCrisLogo } from '~/components/atoms/ProCrisLogo';
import { useAuth } from '~/providers/Auth';

export function ProCrisHeader() {
  const { signOut } = useAuth();

  function onLogout() {
    signOut();
  }

  return (
    <header class="bg-purple-500">
      <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <A href="/admin" class="-m-1.5 p-1.5">
            <ProCrisLogo class="w-40" />{' '}
          </A>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button onClick={onLogout}>Log out</Button>
        </div>
      </nav>
    </header>
  );
}
