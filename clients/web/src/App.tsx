import './App.css';

import { useState } from 'react';

function App() {
  // const { pending, data } = useFetch(
  //   `${import.meta.env.API_URL as string}/report`,
  //   { method: "POST" }
  // );

  console.log(import.meta.env)

  return (
    <form action={`${import.meta.env.VITE_API_URL as string}/report`} encType='multipart/form-data' method="post">
      <input type="file" name='report' />
      <button type="submit">Send file</button>
    </form>
  );
}

export default App;
