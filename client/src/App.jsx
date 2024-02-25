import { Provider } from "react-redux";
import store, { persistor } from "./App/store";
import AppRouter from "./Router/appRouter";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
