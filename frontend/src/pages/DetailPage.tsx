import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../store';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import styled from 'styled-components';
import Head from "../components/Head";
import BackButton from '../components/BackButton';
import Content from 'src/components/common/Content';
import Flex from 'src/components/Flex';
import { AnimalDetail } from 'src/store/models/animal';

const Description = styled.p`
    padding: 0 1rem;
`

const Container = styled.div`
    width: 22em;
    max-width: 100%;
    text-align: center;
    padding: 0 1rem;
`

const Image = styled.img`
    max-width: 100%;
    height: 15rem;
`;

const Extlink = styled.a`
    text-decoration: underline;
    color: blue;
    font-size: 1rem;
    width: 100%;
`;

const EmptyImageIcon = styled.i`
    color: #1d9d74;
    font-size: 10em;
    width: 100%;

`;

const ExlinkContainer = styled.div`
  align-content: space-between;
  justify-content: space-between;
  margin-top: 2rem;
  flex-flow: column wrap;
  display: flex;
  justifyContent: center;
  width: 100%;
  max-width: 100%;
`;

const ExtlinkWrapper =  styled.div`
    width: 100%;
    margin-top: 0.5rem;
`

interface id {
    id?: string | undefined;
}

export default function DetailPage() {

    const { id }: id = useParams();
    const getAnimal = useStoreActions((actions) => actions.animal.getAnimal);
    const animal = useStoreState((state) => state.animal.animal);

    useEffect(() => {
        (async () => {
            await getAnimal(id);
            console.log('animal', animal)
        })();
    }, []);

    return (
        <>
            <Navigation />
            <Head title={'Animals detail'} />
            <BackButton />
            <Content>
                <Container>
                    <h3>{animal?.name}</h3>
                    <i>{animal?.latinname}</i>
                    <Description>{animal?.description}</Description>
                    {animal?.images[0]?.urlName !== ''
                        ? <Image
                            src={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/images/${animal?.images[0]?.urlName}`}
                        />
                        : <Flex justifyContent="center">
                            <EmptyImageIcon className="ra ra-lion ra-5x" />
                        </Flex>
                    }

                    <ExlinkContainer>
                        <h4 style={{width: '100%'}}>Links:</h4>
                        {animal?.extlinks?.map((e, id) => {
                            const link = `${e.link.slice(0, 35)}...`;
                            return (
                                <ExtlinkWrapper key={id}>
                                    <p>
                                        <Extlink href={e.link} target={'_blank'} style={{}}>
                                            {link}
                                        </Extlink>
                                    </p>
                                </ExtlinkWrapper>
                            );
                        })}
                    </ExlinkContainer>
                </Container>
                
            </Content>
            <Footer />
        </>
    );
}
