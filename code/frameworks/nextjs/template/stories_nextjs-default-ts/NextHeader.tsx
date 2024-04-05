import React from 'react';
import { cookies, headers } from 'next/headers';

export default function Component() {
  return (
    <>
      <h3>Headers:</h3>
      <div>
        <p>Name: "timezone"</p>
        <p>Value: "{headers().get('timezone')}"</p>
      </div>

      <h3>Cookies:</h3>
      <div>
        <p>Name: "fullName"</p>
        <p>Value: "{JSON.stringify(cookies().get('fullName'))}"</p>
      </div>
    </>
  );
}
