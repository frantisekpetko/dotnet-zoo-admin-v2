import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';

const CustomizedButtonContainer = styled.div`
    position: fixed;
    top: 80px;
    margin-left: 0.5em;
    z-index: 1000;
`

const CustomizedButton = styled(Button)`
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    //margin-left: 35%;
`;

const BackButton = () => {
    const history = useHistory();

    return <CustomizedButtonContainer>
        <CustomizedButton variant="contained" color="success" onClick={() => history.goBack()}>
            Back
        </CustomizedButton>
    </CustomizedButtonContainer>;
};

export default BackButton;