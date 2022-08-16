import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Avenir Next Regular';
        font-style: normal;
        font-weight: 400;
        src: url(./assets/fonts/AvenirNext-Regular.ttf) format('truetype');
      }
      @font-face {
        font-family: 'Avenir Next Medium';
        font-style: normal;
        font-weight: 500;
        src: url(./assets/fonts/AvenirNext-Medium.ttf) format('truetype');
      }
      @font-face {
        font-family: 'Avenir Next DemiBold';
        font-style: normal;
        font-weight: 700;
        src: url(./assets/fonts/AvenirNext-DemiBold.ttf) format('truetype');
      }
      @font-face {
        font-family: 'Avenir Next Bold';
        font-style: normal;
        font-weight: 800;
        src: url(./assets/fonts/AvenirNext-Bold.ttf) format('truetype');
      }
      `}
  />
);

export default Fonts;
