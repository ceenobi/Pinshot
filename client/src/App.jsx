import { Toaster } from "react-hot-toast";
import { Paths } from "./routes"

function App() {

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Paths />
    </>
  );
}

export default App
