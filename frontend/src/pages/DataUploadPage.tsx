import styled from 'styled-components';
import Head from '../components/Head';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import Content from '../components/common/Content';
import { Button } from '@mui/material';
import Ajax from 'src/tools/Ajax';

function HomePage() {
    async function sendData() {
        try {
            await Ajax.post('/upload');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <Head title={'Zoo Admin'} />
            <Navigation />

            <Content>

                <Button variant="outlined" color="success" onClick={() => sendData()}>
                    Upload App Data
                </Button>

            </Content>

            <Footer />
        </>
    );
}

export default HomePage;
