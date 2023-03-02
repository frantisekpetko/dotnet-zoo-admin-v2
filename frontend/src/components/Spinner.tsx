import Grid from '@mui/material/Grid';
import styled from 'styled-components';

const Loader = styled.div`
    animation: ajax-spinner infinite 1.25s linear;
    //background-color: rgba(39, 62, 84, 0.82);
    background-color: transparent;
    overflow: hidden;

    height: 12rem;
    width: 12rem;
    z-index: 20000;
    font-size: 10em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #66FF00;


    @keyframes ajax-spinner {
        0% {
            -moz-transform: scale(0.85);
            -webkit-transform: scale(0.85);
            -o-transform: scale(0.85);
            -ms-transform: scale(0.85);
            transform: scale(0.85);
            background: rgb(81, 144, 106);
            overflow: hidden;
            z-index: 2;
        }

        25% {
            -moz-transform: scale(0.55);
            -webkit-transform: scale(0.55);
            -o-transform: scale(0.55);
            -ms-transform: scale(0.55);
            transform: scale(0.55);
            background: rgb(17, 58, 97);
            overflow: hidden;
            z-index: 2;
        }

        50% {
            -moz-transform: scale(0.75);
            -webkit-transform: scale(0.75);
            -o-transform: scale(0.75);
            -ms-transform: scale(0.75);
            transform: scale(0.75);
            background: rgb(81, 144, 106);
            overflow: hidden;
            z-index: 2;
        }

        100% {
            -moz-transform: scale(0.85);
            -webkit-transform: scale(0.85);
            -o-transform: scale(0.85);
            -ms-transform: scale(0.85);
            transform: scale(0.85);
            background: rgb(17, 58, 97);
            overflow: hidden;
            z-index: 2;
        }

    }

`;

const MainContainer = styled.div`

    display: flex;
    background-color: transparent;
`

const Spinner = () => (
    <MainContainer>
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
        >

            <Loader className='ra ra-lion'></Loader>

        </Grid>
    </MainContainer>
);

export default Spinner;