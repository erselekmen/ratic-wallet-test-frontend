import { createTheme, ThemeProvider } from "@mui/material";
import Layout from "components/layout";
import Home from "pages/home";
import V2 from "pages/v2";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  const theme = createTheme({});

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/v2" component={V2} />
            <Redirect from="*" to="/" />
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
