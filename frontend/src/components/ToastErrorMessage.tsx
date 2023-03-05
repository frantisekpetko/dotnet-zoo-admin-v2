import { FunctionComponent } from "react";
import styled from 'styled-components';

/*
const ErrorContainer = styled.div`

`;
*/

const Heading = styled.h5`
    margin: 0;
`

const ErrorList = styled.ul`
    padding-left: 0.5em;
    margin: 0.5em;
`;

type Constraint = string[] | { response: { message: string } } | { response: { message: string[] } } | { message: string } | {[property: string]: string};

interface Props {
    message: Constraint
}
 
const ToastErrorMessage: FunctionComponent<Props> = (props) => {



    const renderMessageArray = (errors: any): Constraint => {
        console.log('errors', errors);
        let constraints: any = [];
        if (Array.isArray(errors)) {
            constraints = errors.map((constraint, idx) => <li key={idx}>{constraint}</li>);
        }
        if (errors.hasOwnProperty('response') && errors.response.hasOwnProperty('message') && typeof errors.response.message == 'string') {
            constraints = <li>{errors.message}</li>;
        }

        if (errors.hasOwnProperty('response') && errors.response.hasOwnProperty('message') && Array.isArray(errors.response.message)) {
            constraints = errors.response.message.map((constraint: string, idx: number) => <li key={idx}>{constraint}</li>);
        }
        
        if (typeof errors === 'object' && errors !== null) {
 
            Object.keys(errors).map((key: string, idx: number) => {
                errors[key].map((err, id) => {constraints.push(<li key={`${idx} ${id}`}>{err}</li>)});
            })
        }
        

        return constraints;
    };

    return <>
        <Heading>Oops</Heading>
        <ErrorList>{
        (
            Array.isArray(props.message) || typeof props.message === 'object') 
            ? renderMessageArray(props.message) 
            : <><li>{props.message}</li></>
        }
        </ErrorList>
    </>;
}
 
export default ToastErrorMessage;