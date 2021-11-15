import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { userService } from 'services';
import showNotifications from 'components/Common/Notifications';
import { updateMe, updateMeSuccess } from 'store/auth/login/actions';
import jwt from 'jwt-decode' 
import { useSelector } from 'react-redux';

function EmailEditModal(props) {


    const [initialValues, setInitialValues] = React.useState({
		email: JSON.parse(localStorage.getItem('authUser')).email,
    });

    const validationSchema = Yup.object().shape({
        email: Yup.string().email()
    });

    async function onSubmit(fields, { setStatus, setSubmitting }) {
        try {
            setStatus();
            const response = await userService.updateOwn(fields)
            await localStorage.setItem("authUser", JSON.stringify(jwt(response.token)))
            if(localStorage.getItem('remember')==='1'){
                await localStorage.setItem("access_token", JSON.stringify(response.token))
                updateMeSuccess(jwt(response.token))
                setSubmitting(false);
                showNotifications({
                    title:'Email updated', 
                    type:'success'
                })
                props.toggle()
            } else {
                await sessionStorage.setItem("access_token", JSON.stringify(response.token))
                updateMeSuccess(jwt(response.token))
                setSubmitting(false);
                showNotifications({
                    title:'Email updated', 
                    type:'success'
                })
                props.toggle()
            }
            
        } catch(err) {
            showNotifications({
                title:err.response.data.message, 
                type:'error'
            })
        }
    }


    return (
        <Modal
            isOpen={props.isOpen} 
            toggle={props.toggle}
        > 
            <ModalHeader toggle={props.toggle} tag="h4">
                Update Account Email
            </ModalHeader>
            <ModalBody> 
                <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize={true} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting, setFieldTouched, handleChange, setFieldValue, values }) => (
                    <Form className="signup-form">
                        <div className='col-12'>
                            <div className="form-group">
                                <label for='email'>Email</label>
                                <Field name="email" type="email" placeholder="Email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end pt-4'>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting ? <span className="spinner-border spinner-border-sm mr-1"></span> : 'Update Email'}
                            </button>
                        </div>
                    </Form>
                    )}
                    </Formik>
            </ModalBody>
        </Modal>
    )

}

export default EmailEditModal