import type { PropsWithChildren } from 'react';
import React from 'react';
import { Storybook } from './components/Storybook';

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <div className="page">
            <Storybook>{children}</Storybook>
          </div>
        </main>
      </body>
    </html>
  );
}
