import "./App.css";

function App() {
  return (
    <form
      action={`${import.meta.env.VITE_API_URL as string}/report`}
      encType="multipart/form-data"
      method="post"
    >
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
