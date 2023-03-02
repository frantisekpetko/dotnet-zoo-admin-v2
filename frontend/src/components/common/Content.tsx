import { ReactNode, FC } from 'react';
import Flex from '../Flex';

interface Props {
    children: ReactNode;
}

const Content: FC<Props> = (props: Props ) => {

    return <Flex 
    alignContent='center' 
    direction='column' 
    alignItems='center' 
    justifyContent='center' 
    styles={{
     flex: '1 0 auto',
     width: '100%',
     margin: '5em 0'
    }}>
        {props.children}
    </Flex>
    
    
};

export default Content;
