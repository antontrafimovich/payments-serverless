import "./App.css";
import { usePost } from "./shared/utils/api";

function App() {
  const { post, pending, data } = usePost("/report");

  return (
    <form
      action={`${import.meta.env.VITE_API_URL as string}/report`}
      encType="multipart/form-data"
      method="post"
      onSubmit={(event) => {
        event.preventDefault();

        const form = event.currentTarget;

        const formData = new FormData(form);

        post(formData);
      }}
    >
      {pending && "Loading..."}
      {data && JSON.stringify(data)}
      <label>
        Select bank:{" "}
        <select name="bank" id="bank">
          <option value="pko">PKO</option>
          <option value="millenium">Millenium</option>
        </select>
      </label>

      <label>
        Report: <input type="file" name="report" />
      </label>

      <button type="submit">Send file</button>
    </form>
  );
}

export default App;
