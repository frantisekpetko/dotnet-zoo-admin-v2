import TextField from '@mui/material/TextField';
import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Button, IconButton, InputAdornment } from '@mui/material';
import Navigation from 'src/components/common/Navigation';
import { useStoreActions } from '../store';
import Head from '../components/Head';
import Content from '../components/common/Content';
import Footer from '../components/common/Footer';
import { toast } from 'react-toastify';
import ToastErrorMessage from 'src/components/ToastErrorMessage';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Heading = styled.h1`
    margin-top: 0;
    text-align: center;
`;

const FormContainer = styled.div`
    max-width: 450px;
    border-radius: 5px;
    padding: 1em;
`;

const FormField = styled(TextField)`
    width: 100%;
`;


const RegisterPage: FC = (props: any) => {
    const signUp = useStoreActions((actions) => actions.user.signUp);

    const navigate = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const submit = async () => {

        try {
            await signUp({ username, password });

            toast.success('You are registered!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                icon: false

            });

        } catch (error: any) {
            console.log('errorMessage', JSON.parse(JSON.stringify(error.response.data.errors)));

            let errorMessage = {message: 'Unknown error'};

            if (error.response.data.hasOwnProperty('errors'))
            {
                errorMessage = error.response.data.errors;
            }

            if (error.response.data.hasOwnProperty('message'))
            {
                errorMessage = error.response.data.message;
            }

            //const errorMessage = error.response.data.message;
            toast.error((
                <ToastErrorMessage message={errorMessage} />
            ), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                icon: false

            });

        }
    };

    function goToLogin() {
        navigate.push('/login');
    }

    return (
        <React.Fragment>
            <Head title={'Register Page'} />
            <Navigation />
            <Content>
                <FormContainer>
                    <Heading>User Registration</Heading>
                    <FormField
                        label="Username"
                        margin="dense"
                        variant="filled"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FormField
                        label="Password"
                        margin="dense"
                        variant="filled"
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                                <InputAdornment position="end" sx={{ height: '1rem' }}>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
            
                    />
                    <Button color="inherit" fullWidth onClick={submit}>
                        Register
                    </Button>

                    <Button color="primary" fullWidth onClick={goToLogin} sx={{ mt: 2 }}>
                        Have already account? Sign in now!
                    </Button>
                </FormContainer>
            </Content>
            <Footer />
        </React.Fragment>
    );
};

export default RegisterPage;
