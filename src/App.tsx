import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CaseStudyGrammarly from "@/pages/CaseStudyGrammarly";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/case-study/grammarly" component={CaseStudyGrammarly} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
