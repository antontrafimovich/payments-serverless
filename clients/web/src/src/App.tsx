import "./App.css";

function App() {
  return (
    <form
      action={`${import.meta.env.VITE_API_URL as string}/report`}
      encType="multipart/form-data"
      method="post"
    >
      <input type="file" name="report" />
      <button type="submit">Send file</button>
    </form>
  );
}

export default App;
