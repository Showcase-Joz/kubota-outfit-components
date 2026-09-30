import { createGlobalStyle } from "styled-components";

export const Minireset = createGlobalStyle`
  /*minireset.css*/
  html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:unset;font-weight:normal}ul{list-style:none}button,input,select,textarea{margin:0}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}img,embed,iframe,object,audio,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0;text-align:left}
  html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-family: 'Noto Sans', Arial, sans-serif; line-height: 1; -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: rgba(0,0,0,0); }
`;
