import styled from 'styled-components';
import Head from '../components/Head';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import Content from '../components/common/Content';
import { useRef} from 'react';

export const Heading = styled.h2`
    text-align: center;
    padding: 0 0.5em;
    font-family: 'Nothing You Could Do', cursive;
    font-display: swap;
    font-weight: 700;
    font-size: 4rem;
    margin-bottom: 2rem !important;
    margin-top: 2rem;
`;

function OpeningPage() {

    let isAuth = useRef<string | null>(sessionStorage.getItem('accessToken'));

    return (
        <>
            <Head title={'Zoo Admin'} />
            <Navigation />
            <>
                <Content>
                    <Heading className={'heading'}>
                        {!isAuth.current ? 'Basic zoo admin app' : 'Hey, You are logged in !'}
                    </Heading>
                </Content>
            </>
            <Footer />
        </>
    );
}

export default OpeningPage;
