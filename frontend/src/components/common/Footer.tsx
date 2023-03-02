import { FC } from "react";
import styled from 'styled-components';

const FooterElement = styled.footer`
    border-top: solid #c0c0c0 medium;
    width: 100%;
    background-color: darkolivegreen;
    height: auto;
    //background-color: #64aa66;
    //color: #c0c0c0;
    color: white;
    font-weight: bolder;
    transition: background-color 2s;
    -webkit-transition: background-color 2s;
    flex-shrink: 0;  
    text-align: center;  
    padding: 1em 0 1em 0;
  
    &:hover {
        background-color: #99cc33;
        color: black;
        border-color: black;
    }
`;

const HandWrited = styled.div`
    font-family: 'Kaushan Script', cursive;
    font-display: swap;
    font-size: 2rem;
    margin-bottom: 0.25em;
    padding: 0 0.5em;
    max-width: 100%;
`;

const FooterCustomText = styled.div`
    font-family: 'Special Elite', cursive;
    font-display: swap;
    padding: 0 0.5em;
`;

const Footer: FC<{}> = () => {
    return (
        <FooterElement>
            <FooterCustomText>
                Copyright&copy; {new Date().getFullYear()} Zoo Admin

            </FooterCustomText>
            <HandWrited>Created by František Petko</HandWrited>
            <FooterCustomText>Powered by NodeJS, NestJS, ReactJS, MUI and my skills.</FooterCustomText>
        </FooterElement>
    );
};

export default Footer;
