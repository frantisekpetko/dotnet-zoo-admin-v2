import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem} from '@mui/material';
import { AccountCircle, Clear as ClearIcon} from '@mui/icons-material';

import { useStoreActions } from '../../store';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Flex from 'src/components/Flex';
import StyledMQ, { BreakpointsString } from 'src/tools/styledMQ';


const CustomizedAppBar = styled(AppBar)`
  height: 4em;
  min-height: 4em;
  height: auto;
  background-color: darkolivegreen !important;
  color: white;
`;

const IconButtonMenu = styled(IconButton)`
  display: none;
  ${StyledMQ([
    {
        breakpoint: BreakpointsString.XS,
        rules: `
            display: inline-block !important;
            `
    },
    {
        breakpoint: BreakpointsString.SM,
        rules: `
            display: none !important;
            `
    }
])}
`


const CustomizedLink = styled(Link)`
  color: white;
  text-decoration: none !important;
  display: inline;



  ${StyledMQ([
    {
        breakpoint: BreakpointsString.XS,
        rules: `
            display: none;
            `
    },
    {
        breakpoint: BreakpointsString.SM,
        rules: `
            display: inline;
            `
    }
])}
`;

const AppLink = styled(Link)`
    color: white;
    text-decoration: none;
`

const AppHeading = styled.span`
    font-size: 1.25em;
    font-weight: 400 !important;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
`;

const Logo = styled.span`
    background-color: transparent;
    overflow: hidden;
    height: 3rem;
    width: 3rem;
    font-size: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    ${StyledMQ([
    {
        breakpoint: BreakpointsString.XS,
        rules: `
            display: none;
        `
    },
    {
        breakpoint: BreakpointsString.SM,
        rules: `
            display: flex;
        `
    }
])} 
`;

const Sidenav = styled.div`
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  text-align: center;
  background-color: darkolivegreen;
  overflow-x: hidden;
  padding-top: 60px;
  transition: 0.5s;


  & a {
    padding: 8px 32px 8px 32px;
    text-decoration: none;
    font-size: 25px;

    color: #111;
    display: block;
    transition: 0.3s;
  }

  & a:hover { 
    background-color: #000000;
    color: darkolivegreen;
  }


`;

const CloseButton = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 36px;
  padding-right: 0.85em;

  &:hover {
    background-color: #000000;
    color: darkolivegreen;
  }
`

const FlexContainer = styled(Flex)`
    ${StyledMQ([
        {
            breakpoint: BreakpointsString.XS,
            rules: `
            display: none;
        `
        },
        {
            breakpoint: BreakpointsString.SM,
            rules: `
            line-height: 
        `
        }
    ])} 
`

export default function Navigation() {
    const load = useStoreActions((actions) => actions.user.loadTokenToMemory);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);

    const handleFullscreenMenu = () => {
        //console.log(open);
        setOpen(!open);
    };

    const logOut = useStoreActions((actions) => actions.user.logOut);
    const token = sessionStorage.getItem('accessToken');
    const navigate = useHistory();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        if (token != null) {
            console.log('tokenx', token);
        }
        setAnchorEl(null);

        logOut();
        //load();

        window.location.reload();
        //navigate.replace('/');
    };

    return (
        <>
            <Sidenav style={open ? { width: '100%', zIndex: 9999999 } : { width: '0' }}>
                <CloseButton href={"#"} onClick={() => handleFullscreenMenu()}>
                    <ClearIcon />
                </CloseButton>
                {token !== null ? (
                    <>
                        <Link to="/" onClick={() => handleFullscreenMenu()}>
                            HomePage
                        </Link>
                        <Link to="/animals" onClick={() => handleFullscreenMenu()}>
                            Animals
                        </Link>
                        <Link to="/animals/create" onClick={() => handleFullscreenMenu()}>
                            Create New Animal
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => handleFullscreenMenu()}>
                            Login
                        </Link>
                        <Link to="/register" onClick={() => handleFullscreenMenu()}>
                            Register
                        </Link>
                    </>
                )}
            </Sidenav>

            <CustomizedAppBar
                position='fixed'
            >
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    {/*'#ACE500'*/}

                    <Typography variant="h6" component="div">

                        <AppLink to="/">
                            <Flex direction='row' styles={{ gap: '0.5em', padding: '0.6em', lineHeight: '2.5em' }}>
                                <Logo className='ra ra-lion' />
                                <AppHeading>Zoo Admin</AppHeading>
                            </Flex>
                        </AppLink>
                    </Typography>

                    <Flex direction='row' justifyContent='flex-end' styles={{ lineHeight: '3em' }}>
                        {token !== null ? (
                            <Box>
                                <CustomizedLink to={'/animals'}>
                                    <Button color="inherit">List of Animals</Button>
                                </CustomizedLink>
                                <CustomizedLink to={'/animals/create'}>
                                    <Button color="inherit">Create New Animal</Button>
                                </CustomizedLink>

                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={(e) => handleMenu(e)}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>

                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>{sessionStorage.getItem('username') !== null ? sessionStorage.getItem('username') : 'Account'}</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </Box>
                        ) : (
                            <Box>
                                <CustomizedLink to={'/login'} className={'customized-link'}>
                                    <Button color="inherit">Login</Button>
                                </CustomizedLink>
                                <CustomizedLink to={'/register'} className={'customized-link'}>
                                    <Button color="inherit">Register</Button>
                                </CustomizedLink>
                            </Box>
                        )}

                        <IconButtonMenu size="large" edge="start" color="inherit" aria-label="menu" sx={{ ml: 0 }} onClick={() => handleFullscreenMenu()}>
                            <MenuIcon />
                        </IconButtonMenu>
                    </Flex>
                </Toolbar>
            </CustomizedAppBar>

        </>
    );
}
