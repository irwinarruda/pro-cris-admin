import { ProCrisLogo } from '~/components/atoms/ProCrisLogo';

export function ProCrisSplash() {
  return (
    <div class="w-screen h-screen bg-purple-500">
      <div class="h-full py-16 mx-auto flex-1 flex flex-col items-center justify-center">
        <ProCrisLogo class="flex-1 w-80" />
        <p class="font-quotes text-3xl text-white">Irwin Arruda</p>
      </div>
    </div>
  );
}
