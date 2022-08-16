import styled from '@emotion/styled';

import { Box, Container } from '@chakra-ui/react';

import { NavBar } from '@dolby-io-uikit/react-ui';

import { Route } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { LibraryPage } from './ui/pages/library/library.page';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <StyledApp>
        <Box bgColor={'base.gray.02.value'} w={'100vw'} height={'100vh'}>
          <div role="navigation">
            <NavBar></NavBar>
          </div>
          <Route
            path="/"
            exact
            render={() => (
              <Container centerContent w={'8xl'} padding="8">
                <LibraryPage></LibraryPage>
                {/* <Link to="/page-2">Click here for page 2.</Link> */}
              </Container>
            )}
          />
          {/* <Route
        path="/page-2"
        exact
        render={() => (
          <div>
            <Link to="/">Click here to go back to root page.</Link>
          </div>
        )}
      /> */}
        </Box>
      </StyledApp>
    </DndProvider>
  );
}

export default App;
