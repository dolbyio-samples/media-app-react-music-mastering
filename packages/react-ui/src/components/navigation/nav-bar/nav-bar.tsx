/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DolbyIoLogo } from '../../../assets';

export const NavBar = () => {
  return (
    <div
      css={css`
        position: sticky;
        justify-content: space-around;
        -webkit-box-align: center;
        align-items: center;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 200;
        height: fit-content;
        grid-area: header / header / header / header;
      `}
    >
      <div
        css={css`
          background-color: rgba(0, 0, 0, 0.9);
          position: relative;
          padding: 10px 25px;
        `}
      >
        <a href={'https://dolby.io'} target="_blank">
          <DolbyIoLogo
            css={css`
              width: 160px;
              transform: translate(0px, 5px);
            `}
          />
        </a>
      </div>
    </div>
  );
};

export default NavBar;
