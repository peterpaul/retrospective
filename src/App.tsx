import { RetrospectiveProvider } from "./state";
import { useRoute } from "./router";
import Dashboard from "./screens/Dashboard";
import PrepareRetrospective from "./screens/PrepareRetrospective";
import PreviousRetrospective from "./screens/PreviousRetrospective";
import OngoingRetrospective from "./screens/OngoingRetrospective";

function Shell() {
  const route = useRoute();

  let screen;
  switch (route.name) {
    case "dashboard":
      screen = <Dashboard />;
      break;
    case "prepare":
      screen = <PrepareRetrospective />;
      break;
    case "retrospective":
      screen = <PreviousRetrospective id={route.id} />;
      break;
    case "ongoing":
      screen = <OngoingRetrospective id={route.id} />;
      break;
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      {screen}
    </div>
  );
}

export default function App() {
  return (
    <RetrospectiveProvider>
      <Shell />
    </RetrospectiveProvider>
  );
}
