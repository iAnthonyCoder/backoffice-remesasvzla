import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

function EmailEditModal(props) {

    const [initialValues, setInitialValues] = React.useState({
		email: '',
    });

    const validationSchema = Yup.object().shape({
        email: Yup.string().email()
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        try {
            setStatus();
            // userService.updateOwn(fields)
        } catch(er) {
            showNotifications('Error', err.response.data.message, 'error')
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
                            <button type="submit" disabled={props.actionsLoading} className="btn btn-primary">
                                {props.actionsLoading ? <span className="spinner-border spinner-border-sm mr-1"></span> : 'Update Email'}
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