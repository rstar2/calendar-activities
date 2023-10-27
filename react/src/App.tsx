import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Container, Stack } from "@chakra-ui/react";

import Nav from "./components/Nav";
import Users from "./components/Users";
import Activities from "./components/Activities";
import Copyright from "./components/Copyright";

function App() {
  return (
    <Container maxW="container.lg" h="100%">
      <Stack h="100%">
        <Nav flexGrow={0} />
        <Box flexGrow={1}>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />

            {/* no match route */}
            <Route path="*" element={<Navigate to="/activities" />} />
          </Routes>
        </Box>
        <Copyright py={4} />
      </Stack>
    </Container>
  );
}

export default App;
