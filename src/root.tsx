// @refresh reload
import { Suspense } from 'solid-js';
import { Link, Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from 'solid-start';
import './root.css';

export default function Root() {
  return (
    <Html lang="pt-BR">
      <Head>
        <Title>Pro Cris Dashboard</Title>
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Link href="https://fonts.googleapis.com/css2?family=Yellowtail&display=swap" rel="stylesheet" />
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
