import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import showNotifications from 'components/Common/Notifications';
import { userService } from 'services';
import jwt from 'jwt-decode' 
import { updateMeSuccess } from 'store/actions';

function PasswordEditModal(props) {

    const [initialValues, setInitialValues] = React.useState({
		password: '',
        new_password: '',
    });

    const validationSchema = Yup.object().shape({
        password: Yup.string().min(5),
        new_password: Yup.string().min(5)
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
                    title:'Password updated', 
                    type:'success'
                })
                props.toggle()
            } else {
                await sessionStorage.setItem("access_token", JSON.stringify(response.token))
                updateMeSuccess(jwt(response.token))
                setSubmitting(false);
                showNotifications({
                    title:'Password updated', 
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
                Update Account Password
            </ModalHeader>
            <ModalBody> 
                <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize={true} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting, setFieldTouched, handleChange, setFieldValue, values }) => (
                    <Form className="signup-form">
                        <div className='col-12'>
                            <div className="form-group">
                                <label for='password'>Current Password</label>
                                <Field name="password" type="password" placeholder="Password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className='col-12 pt-4'>
                            <div className="form-group">
                                <label for='new_password'>New Password</label>
                                <Field name="new_password" type="password" placeholder="New password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="new_password" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end pt-4'>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting ? <span className="spinner-border spinner-border-sm mr-1"></span> : 'Update Password'}
                            </button>
                        </div>
                    </Form>
                    )}
                    </Formik>
            </ModalBody>
        </Modal>
    )

}

export default PasswordEditModal