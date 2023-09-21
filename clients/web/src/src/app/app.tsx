import { Routing } from "../pages/routing";
import { withProviders } from "./providers";

function App() {
  return <Routing />;
}

export default withProviders(App);
