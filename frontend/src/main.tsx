import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import BootLoader from "./components/BootLoader.tsx";

function Root() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <BootLoader onComplete={() => setBooted(true)} />}
      {booted && <App />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
