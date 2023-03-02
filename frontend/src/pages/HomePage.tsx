import React, { useEffect, FC } from 'react';
import 'src/App.css';
import styled from 'styled-components';
import Head from '../components/Head';
import Navigation from '../components/common/Navigation';
import { Grid } from '@mui/material';
import Footer from '../components/common/Footer';
import Content from '../components/common/Content';
import { Heading } from 'src/components/Heading';

function HomePage() {
    return (
      <>
          <Head title={'Zoo Admin'} />
          <Navigation />
          
              <Content>
                  <Heading>
                      Hey, You are logged in !
                  </Heading>
              </Content>
          
          <Footer />
      </>
    );
}

export default HomePage;
