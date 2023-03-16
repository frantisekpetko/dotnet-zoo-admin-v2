import {
    useState,
    useRef,
    FC,
    useEffect
} from 'react';

import styled from 'styled-components';
import { toast } from 'react-toastify';

import Head from 'src/components/Head';
import Navigation from 'src/components/common/Navigation';
import Footer from 'src/components/common/Footer';
import BackButton from 'src/components/BackButton';
import Content from 'src/components/common/Content';
import UploadImage from 'src/components/UploadImage';
import ToastErrorMessage from 'src/components/ToastErrorMessage';
import { Heading } from 'src/components/Heading';
import { SubmitButton } from 'src/components/SubmitButton';
import { ExtlinkTextField } from 'src/components/ExtlinkInputField';
import { ExtlinkRemoveButton } from 'src/components/ExtlinkRemoveButton';

import Ajax from 'src/tools/Ajax';
import { useStoreActions } from 'src/store';

import { Formik, Form, useFormik } from 'formik';
import * as Yup from 'yup';

import {
    Add as AddIcon,
    Remove as RemoveIcon
} from '@mui/icons-material';
import {
    TextField,
    Button,
    Fab
} from '@mui/material';




interface Image {
    id?: number;
    urlname?: string;
}

const InputField = styled(TextField)`
    margin-bottom: 1rem !important;
    width: 17rem;
`;

const HeadingCenter = styled.div`
    text-align: center;
`;

const ExtlinkWrapper = styled.div`
    display: flex;
    direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 100%;
`;



const CreatePage: FC = () => {

    const saveAnimal = useStoreActions((actions) => actions.animal.saveAnimal);

    const [extlinks, setExtlinks] = useState(['']);
    const [isCheckingForm, setIsCheckingForm] = useState(false);
    const [extlinksErrors, setExlinksErrors] = useState<string[]>(['']);

    const animalRef: any = useRef({
        name: '',
        latinname: '',
        description: '',
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Required'),
        latinname: Yup.string()
            .required('Required'),
        description: Yup.string()
            .required('Required')
    });

    const formik = useFormik({
        initialValues: { ...animalRef.current },
        onSubmit: (values, errors) => { },
        validationSchema: validationSchema
    });

    const handleChange = (e, index) => {
        const { value } = e.target;

        const data = [...extlinks];
        data[index] = value;
        //console.error('data', data, index);
        setExtlinks([...data]);
        //console.log('data after setState', extlinks, index);
    };

    const checkForm = (e) => {
        e.preventDefault();
        setIsCheckingForm(true);
        const values = validate(e.target.name);
        setExlinksErrors([...values]);
        setIsCheckingForm(false);
    };

    const validate = (formFieldName) => {
        let errors: string[] = [];

        const isValidUrl = (u) => {
            let elm;
            if (!elm) {
                elm = document.createElement('input');
                elm.setAttribute('type', 'url');
            }
            elm.value = u;
            //console.error(u, elm.validity.valid);
            return elm.validity.valid;
        };


        extlinks.forEach((item, index) => {
            if (!item) {
                if (!isCheckingForm || formFieldName === 'extlinks') {
                    errors[index] = "Required";
                }
            } else if (!isValidUrl(item)) {
                if (!isCheckingForm || formFieldName === 'extlinks') {
                    errors[index] = "Enter correct url";
                }

            }
        });

        //console.error('errors', errors);
        return errors;
    };




    function addNewExtlink() {
        const tempExtlinks = [...extlinks];
        tempExtlinks.push('');
        setExtlinks([...tempExtlinks]);
    }

    function removeExtlink(id) {
        const filteredItems = extlinks.filter((item, index) => {
            const idx = extlinks.indexOf(item);
            return id !== index;
        })

        setExtlinks(filteredItems);
        animalRef.current.extlinks = [...filteredItems];
    }


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


    const handleSubmit = async (e) => {
        e.preventDefault();
        formik.setSubmitting(true);
        formik.handleSubmit();


        const values = validate('extlinks');
        setExlinksErrors([...values]);


        const errs: any = formik.errors;
        //console.log('saveAnimal', !(errs.length > 0), !(values.length > 0))
        if (!(values.length > 0) && !(errs?.length > 0)) {
            try {
                let data: any = '';
                if (selectedFile !== null) {
                    const formData = new FormData();
                    formData.append('image', selectedFile);
      		    formData.append('fileName', selectedFile.name);
                    data = (await Ajax.post('animals/file', formData));
                }

                //console.log('saveAnimal', data?.data?.image)
                await saveAnimal({ ...formik.values, extlinks, image: data?.data?.image !== undefined ? data?.data?.image : '' });
                toast.success('You have successfully created new animal!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    icon: false,
                    style: width < 480 ? { width: '97%' } : undefined

                });
            } catch (error: any) {
                const message = error.response.data.message;
                console.log('errorMessage', message);
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
                    icon: false,
                    style: width < 480 ? { width: '97%' } : undefined

                });
            }
        }
        formik.setSubmitting(false);

    };

    const [selectedFile, setSelectedFile] = useState<any>(null);


    return <>
        <Head title={'Create Animal'} />

        <Navigation />
        <BackButton />
        <Content>
            <HeadingCenter>
                <Heading>Create Animal</Heading>
            </HeadingCenter>
            <UploadImage setSelectedFile={setSelectedFile} />

            <InputField
                error={formik.touched?.name && formik.errors?.name ? true : false}
                id="filled-error-helper-text"
                label="Name"
                value={formik.values?.name}
                helperText={formik.touched.name && formik.errors?.name
                    ? formik.errors.name
                    : null}
                variant="filled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                name="name"
            />

            <InputField
                error={formik.touched.latinname && formik.errors.latinname ? true : false}
                id="filled-error-helper-text"
                label="Latin name"
                value={formik.values.latinname}
                helperText={formik.touched.latinname && formik.errors.latinname
                    ? formik.errors.latinname
                    : null}
                variant="filled"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                name="latinname"
            />

            <InputField
                id="filled-multiline-static"
                label="Description"
                multiline
                rows={5}
                error={formik.touched.description && formik.errors.description ? true : false}
                variant="filled"
                value={formik.values.description}
                helperText={formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : null}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                name="description"
            />
            {/*console.log('extlinks', extlinks)*/}
            {extlinks?.map((extlink, index) => {
                return (<ExtlinkWrapper key={index}>
                    <ExtlinkTextField
                        error={true ? (extlinksErrors[index] ? true : false) : false}
                        id="filled-error-helper-text"
                        label="External url link"
                        value={extlink}
                        helperText={true ? (extlinksErrors[index]
                            ? extlinksErrors[index]
                            : null) : null}
                        variant="filled"
                        onChange={(e) => handleChange(e, index)}
                        onBlur={(e) => checkForm(e)}
                        type="text"
                        name={`extlinks[${index}]`}
                    />

                    <ExtlinkRemoveButton
                        aria-label="add"
                        onClick={() => removeExtlink(index)}
                        color="secondary"
                    >
                        <RemoveIcon />
                    </ExtlinkRemoveButton>
                </ExtlinkWrapper>)
            }
            )}

            <Fab aria-label="remove" onClick={addNewExtlink} color="secondary" style={{ marginBottom: '1rem', minWidth: '4em', minHeight: '4em' }}>
                <AddIcon />
            </Fab>

            <SubmitButton
                variant="contained"
                disabled={formik.isSubmitting}
                color="inherit"
                type="submit"
                onClick={async (e) => {
                    handleSubmit(e);
                }}>
                Create Animal
            </SubmitButton >
        </Content>
        <Footer />
    </>
        ;
}

export default CreatePage;