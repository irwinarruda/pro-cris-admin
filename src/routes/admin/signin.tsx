import { createSignal } from 'solid-js';
import { createRouteData } from 'solid-start';
import { Button } from '~/components/atoms/Button';
import { ProCrisLogo } from '~/components/atoms/ProCrisLogo';
import { TextField } from '~/components/molecules/TextField';
import { useAuth } from '~/providers/Auth';

export function routeData() {
  return createRouteData(() => ({
    props: { title: 'Pro cris dashboard' },
  }));
}

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  async function onSubmit(
    e: Event & {
      submitter: HTMLElement;
    },
  ) {
    e.preventDefault();
    console.log('email', email());
    console.log('password', password());
    await signIn({ email: email(), password: password() });
  }

  return (
    <div class="h-full pt-40">
      <div class="mx-auto w-3/12 rounded-xl overflow-hidden bg-alpha-white border-gold-500 border-2">
        <div class="flex items-center justify-center w-full py-6 bg-purple-500">
          <ProCrisLogo class="w-56" />
        </div>
        <form class="px-4 pt-5 pb-5" onSubmit={onSubmit}>
          <h1 class="text-black text-xl font-semibold">Fazer Login</h1>
          <TextField label="Email" class="mt-4" value={email()} onChange={setEmail} />
          <TextField label="Senha" class="mt-3" type="password" value={password()} onChange={setPassword} />
          <div class="flex justify-center mt-6 w-full">
            <Button class="mx-auto">Entrar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
