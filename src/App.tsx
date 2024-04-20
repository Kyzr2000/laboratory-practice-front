import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { __DEV__ } from '@apollo/client/utilities/globals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import MyRoutes from './router';

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#0396a8',
    },
    secondary: {
      main: '#32b5aa',
      contrastText: 'white',
    },
  },
});

function App() {
  return (
    <div>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <MyRoutes></MyRoutes>
          </BrowserRouter>
        </ThemeProvider>
      </RecoilRoot>
    </div>
  );
}

export default App;
