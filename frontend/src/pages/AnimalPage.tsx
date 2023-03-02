import { useState, useEffect } from 'react';

import _SearchField from 'src/vendor/SearchField';
import Flex from 'src/components/Flex';
import Navigation from 'src/components/common/Navigation';
import Footer from 'src/components/common/Footer';
import Content from 'src/components/common/Content';
import ContenLoader from 'src/components/ContentLoader';
import Head from "src/components/Head";

import { useStoreActions, useStoreState } from 'src/store';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import {
    Box,
    CardMedia,
    Pagination,
    Typography,
    CardActions,
    CardContent,
    Button,
    Grid,
    Card
} from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import EditIcon from '@mui/icons-material/Edit';

library.add(fab, faChevronRight, faTrash);

const CustomizedCard = styled(Card)`
    min-height: 24em;
    margin-bottom: 0 !important;
`

const SearchField = styled(_SearchField)`
    margin-top: 2rem;
    width: 100vw;
    color: black;
`

const SearchFieldContainer = styled(Box)`
    width: 100%;
    display: flex;
    justify-content: center;    
    padding: 0 50px;
    height: 70px;
    z-index: 1000;
    margin-top: 20px;
`

const Icon = styled(FontAwesomeIcon)`
    margin-left: 0.5rem;

    &:hover ${this} {
        color: black;
    }
`;

const DetailButton = styled(Button)`
    color: black;
`;

const DeleteButton = styled(Button)`
    color: red !important;
`;


const UpdateButton = styled(Button)`
    color: green !important;
`;

const NoData = styled.div`

    font-size: 2rem; 
`

const AnimalsGrid = styled(Grid)`
    padding-left: 50px;
    padding-right: 50px;
`


const EmptyCardContent = styled.div`
    color: #1d9d74;
    height: 194px;
    font-size: 12em;
`


const AnimalPage = () => {

    const history = useHistory();

    const page = useStoreState((state) => state.animal.page);
    const limit = useStoreState((state) => state.animal.limit);
    const pages = useStoreState((state) => state.animal.pages);
    const getPages = useStoreActions((actions) => actions.animal.getPages);

    const searchString = useStoreState((state) => state.animal.search);
    const setSearchString = useStoreActions((state) => state.animal.setSearch);

    const setPage = useStoreActions((actions) => actions.animal.setPage);

    const getAnimals = useStoreActions((actions) => actions.animal.getAnimals);
    const animals = useStoreState((state) => state.animal.animals);

    const deleteAnimal = useStoreActions((actions) => actions.animal.deleteAnimal);


    const [text, setText] = useState('');

    const [width, setWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
        const listener = () => {
            return setWidth(window.innerWidth);
        };

        listener();

        window.addEventListener('resize', listener);

        return function cleanup() {
            window.removeEventListener('resize', listener);
        };
    }, []);

    useEffect(() => {
        history.push({
            pathname: '/animals',
            search: '?page=' + page,
        });
        (async () => {
            //console.warn({searchString});
            await getPages({ limit: limit, search: searchString });
            await getAnimals({ page: page, limit: limit, search: searchString });
        })();
    }, []);

    function handleClick(page) {
        //parseInt("" + params.get("page")
        setPage(page);
        history.push({
            pathname: '/animals',
            search: '?page=' + page,
        });
        (async () => {
            await getPages({ limit: limit, search: searchString });
            await getAnimals({ page: page, limit: limit, search: searchString });
        })();
    }

    function filterData() {
        //console.log('searchString', searchString);
        (async () => {
            setPage(1);
            await getPages({ limit: limit, search: searchString });
            const data = await getAnimals({ page: 1, limit: limit, search: searchString });

            //console.log('animalsLength', data.length);
            if (data.length === 0) {
                setText('No data found');
                console.warn('setText', pages);
            } else {
                setText('');
            }
        })();

        //console.error('pages', pages);
    }

    function updateSearchString(value, e) {
        setSearchString(value);
    }

    async function itemDelete(id) {
        await deleteAnimal(id);
        let actualPage = page;
        console.log('animalslength', animals.length == 0, animals.length);
        if (animals.length == 1) {
            actualPage = page - 1;
            setPage(actualPage)
            console.log('set page', page);
        }

        await getPages({ limit: limit, search: searchString });

        await getAnimals({ page: actualPage, limit: limit, search: searchString });

        history.push({
            pathname: '/animals',
            search: '?page=' + actualPage,
        });
    }

    return (
        <>
            <Head title={'Animals'} />

            <Navigation />
            <Content>
                <SearchFieldContainer>
                    <SearchField
                        searchText={searchString}
                        placeholder="Search..."
                        classNames="search-field"
                        onEnter={() => filterData()}
                        onChange={(value, e) => updateSearchString(value, e)}
                        onSearchClick={() => filterData()}
                        style={{ marginBottom: text === '' ? '5rem' : '0rem' }}
                    />
                </SearchFieldContainer>
                {/*text === '' ? null : <NoData>{text}</NoData>*/}

                {animals.length > 0 ? (
                    <AnimalsGrid container spacing={10}>

                        {animals.map((animal) => {
                            return (
                                <Grid item xs={12} sm={6} lg={4} xl={3} key={animal.id} sx={{marginBottom: 0}}>
                                    <CustomizedCard>
                                        {
                                            animal?.images[0]?.urlName !== ''
                                                ?
                                                <CardMedia
                                                    component="img"
                                                    height="194"
                                                    image={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/images/${animal?.images[0]?.urlName}`}
                                                    alt={`${animal.latinname}`}
                                                />
                                                :
                                                <Flex justifyContent="center">
                                                    <EmptyCardContent className="ra ra-lion ra-5x"></EmptyCardContent>
                                                </Flex>
                                        }

                                        <CardContent>
                                            <Typography className="bold" variant="subtitle1" gutterBottom component="h2">
                                                {animal.name}
                                            </Typography>
                                            <Typography component="p">
                                                <i>{animal.latinname}</i>
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ marginTop: '3em' }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="center"
                                                alignContent="flex-end" alignItems="flex-end"
                                            >


                                                <UpdateButton size="small" onClick={() => history.push(`/animals/update/${animal.id}`)}>
                                                    Update <EditIcon className="text-and-icon-space" />
                                                </UpdateButton>

                                                <DeleteButton size="small" onClick={() => itemDelete(animal.id)}>
                                                    Delete <Icon className="text-and-icon-space" icon="trash" />
                                                </DeleteButton>

                                                <DetailButton size="small" onClick={() => history.push(`/animals/detail/${animal.id}`)}>
                                                    Detail <Icon className="text-and-icon-space" icon="chevron-right" />
                                                </DetailButton>
                                            </Grid>
                                        </CardActions>
                                    </CustomizedCard>
                                </Grid>
                            )
                        })}
                        
                    </AnimalsGrid>)
                    : (text !== '' ? 
                    (<AnimalsGrid container spacing={10}>
                        <Grid item xs={12} sm={12} lg={12} xl={12} sx={{ marginTop: '2em', textAlign: 'center' }}>
                            <NoData>{text}</NoData>
                        </Grid>
                    </AnimalsGrid>) : (<ContenLoader animals={Array(12).fill(0)}/>)
                )}

                {pages !== null ? (
                    <Pagination
                        page={page}
                        color="primary"
                        count={pages}
                        variant="outlined"
                        shape="rounded"
                        size={width !== null ? (width <= 430 ? 'medium' : 'large') : 'large'}
                        onChange={(e, page) => handleClick(page)}
                        style={{
                            marginTop: text === '' ? '3rem' : '8em',
                            marginBottom: '1rem',
                            padding: width <= 430 ? '0 1em' : '0',

                        }}
                    />
                ) : null}
            </Content>
            <Footer />
        </>
    );
};

export default AnimalPage;
