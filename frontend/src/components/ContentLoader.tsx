import ContentLoader from 'react-content-loader';
import styled from 'styled-components';

import { Grid } from '@mui/material';


const ContentLoaderGrid = styled(Grid)`
  padding: 10px;
`

const CardLoader = (props) => {
    //const width = 600;
    //const height = 750;
    const width = 500;
    const height = 500;
    console.log(props);
    return (
        <>

                {props.animals.length === 1 ? (
                    <ContentLoader
                        speed={3}
                        width={width}
                        height={height}
                        viewBox={`0 0 ${height} ${width}`}
                        backgroundColor="#6a6868"
                        foregroundColor="#ecebeb"
                        {...props}
                    >
                        <circle cx="31" cy="31" r="15" />
                        <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
                        <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
                        <rect x="0" y="60" rx="2" ry="2" width={width} height={height} />
                    </ContentLoader>
                ) : (
                    <Grid container spacing={5} style={{ paddingLeft: 50, paddingRight: 50 }}>
                        {props.animals.map((_, id) => (
                            <ContentLoaderGrid item xs={12} sm={6} lg={4} xl={3} key={id} sx={{ maxWidth: '100%', height: 'auto'}}>
                                <ContentLoader
                                    speed={3}
                                    width={width}
                                    height={height}
                                    viewBox={`0 0 ${height} ${width}`}
                                    backgroundColor="#6a6868"
                                    foregroundColor="#ecebeb"
                                    {...props}
                                    style={{
                                        maxWidth: '100%', height: 'auto'}}
                                >
                                    <circle cx="31" cy="31" r="15" />
                                    <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
                                    <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
                                    <rect x="0" y="60" rx="2" ry="2" width={width} height={height} />
                                </ContentLoader>
                            </ContentLoaderGrid>
                        ))}
                    </Grid>)}
                </>
    );
};

export default CardLoader;
