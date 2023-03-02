import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Button, Grid, IconButton, Paper } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { FC, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Content from 'src/components/common/Content';
import Footer from 'src/components/common/Footer';
import Navigation from 'src/components/common/Navigation';
import ErrorMessage from 'src/components/ToastErrorMessage';
import Head from 'src/components/Head';
import ToastErrorMessage from 'src/components/ToastErrorMessage';
import { useStoreActions, useStoreState } from 'src/store';
import styled from 'styled-components';
import Ajax from 'src/tools/Ajax';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const Heading = styled.h1`
    margin-top: 0;
    color: black;
    text-align: center;
`;

export const FormContainer = styled.div`
    max-width: 450px;
    padding: 1em;
    border-radius: 5px;

`;

const FormField = styled(TextField)`
    width: 100%;
`;


const LoginPage: FC = (props: any) => {
    const signIn = useStoreActions((actions) => actions.user.signIn);

    const load = useStoreActions((actions) => actions.user.loadTokenToMemory);
    const save = useStoreActions((actions) => actions.user.saveTokenToStorage);
    const setUserUsername = useStoreActions((actions) => actions.user.setUsername);

    const navigate = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const submit = async () => {
        try {
            let data = await signIn({ username, password });

            save(data.data?.data?.accessToken);
            setUserUsername(data.data?.data?.username);
            load();

        }
        catch(error: any) {
                toast.dismiss();

                console.log('errorMessage', error);
                const message = error.response.data.message;
                toast.error((
                    <ToastErrorMessage message={message} />
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
        finally {
            if (sessionStorage.getItem('accessToken') !== null) {
                navigate.replace('/');
            }
        }
    };

    function goToRegister() {
        navigate.push('/register');
    }

    const ENTER_KEY = 13;


    const onEnterHandler = useCallback((event) => {
        const isEnterPressed = event.which === ENTER_KEY
            || event.keyCode === ENTER_KEY;

        if (isEnterPressed) {
            submit();
        }

    }, [submit]);

    return (
        <>
            <Head title={'Login Page'} />

            <Navigation />
            <Content>
                <FormContainer>
                    <Heading>User Login</Heading>
                    <FormField
                        label="Username"
                        margin="dense"
                        variant="filled"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleOutlinedIcon />
                                </InputAdornment>
                            ),
                            'aria-label': 'theme'
                        }}
                        onKeyUp={onEnterHandler}
                    />
                    <FormField
                        label="Password"
                        margin="dense"
                        variant="filled"
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end" sx={{height: '1rem'}}>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            'aria-label': 'theme'
                        }}
                        onKeyUp={onEnterHandler}
                    />
                    <Button color="inherit" fullWidth onClick={submit}>
                        Login in
                    </Button>

                    <Button color="primary" fullWidth onClick={goToRegister} sx={{ mt: 2 }}>
                        Don't have an account? Sign up now!
                    </Button>
                </FormContainer>
            </Content>
            <Footer />
        </>
    );
};

export default LoginPage;
