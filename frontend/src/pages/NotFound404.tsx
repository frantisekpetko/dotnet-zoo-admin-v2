import { FC } from 'react';
import 'src/App.css';
import Head from '../components/Head';
import Navigation from '../components/common/Navigation';
import Footer from 'src/components/common/Footer';
import Content from 'src/components/common/Content';
import { Heading } from 'src/components/Heading';
import styled from 'styled-components';


const Description = styled.div`
    font-size: 0.5em;
`

const NotFound404: FC = () => {
    return (
        <>
            <Head title={'404'} />
            <Navigation />
            <Content>
                <Heading style={{ textAlign: 'center' }}>
                    404 Error<br />
                    <Description>
                        Page with url
                        <code>'{window.location.pathname}'</code> 
                        not found.
                    </Description>
                </Heading>
            </Content>
            <Footer/>
        </>
    );
}

export default NotFound404;
