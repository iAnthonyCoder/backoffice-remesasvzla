import React from 'react'
import { SingleSelect } from 'components/Common/SingleSelect';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { currencyService } from 'services';




function ProductForm(props) {

    const [initialValues, setInitialValues] = React.useState({
		currency_to_receive: '',
		currency_to_deliver: '',
        url: '',
        cash_deliver: false,
        isPublished: false
    });

    React.useEffect(() => {
        setInitialValues(props.productToEdit)
    }, [props.productToEdit])

    

    const validationSchema = Yup.object().shape({
        currency_to_receive: Yup.object()
            .required('currency_to_receive is required'),
        currency_to_deliver: Yup.object()
            .required('currency_to_receive is required'),
        url: Yup.string()
            .required('url is required')
            .max(200, 'The url string length cannot contain more than 200 characters'),
        cash_deliver: Yup.boolean(),
        isPublished: Yup.boolean()
    
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        props.handleValidProductSubmit(null, fields)
    }

    return (

        <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize={true} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting, setFieldTouched, handleChange, setFieldValue, values }) => (
            <Form className="signup-form">
                <div className='col-12 mt-3'>
                    <div className="form-group">
						<SingleSelect
							value={values.currency_to_receive}
							onChange={setFieldValue}
							onBlur={setFieldTouched}
							error={errors.currency_to_receive}
							endPoint={currencyService.find}
							touched={touched.currency_to_receive}
							name={"currency_to_receive"}
							title={"Currency To Receive"}
							extraFilter={false}
                            extraQuery={false}
						/>
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    <div className="form-group">
						<SingleSelect
							value={values.currency_to_deliver}
							onChange={setFieldValue}
							onBlur={setFieldTouched}
							error={errors.currency_to_deliver}
							endPoint={currencyService.find}
							touched={touched.currency_to_deliver}
							name={"currency_to_deliver"}
							title={"Currency To Deliver"}
							extraFilter={false}
                            extraQuery={false}
						/>
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    <div className="form-group">
                        <label className="form-label ml-2" for="url"> Url</label>
                        <Field type="text" name="url" placeholder='Url' className='form-control' />
                        <ErrorMessage name="url" component="div" className="invalid-feedback" />
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    <div className="form-group d-flex align-items-center">
                        <Field type="checkbox" name="cash_deliver" id='cash_deliver' />&nbsp;
                        <label className="form-label ml-2 mb-0" for="cash_deliver"> Cash Deliver (EFE)</label>
                        <ErrorMessage name="cash_deliver" component="div" className="invalid-feedback" />
                    </div>
                </div>
                {console.log(errors)}
                <div className='col-12 mt-3'>
                    <div className="form-group d-flex align-items-center">
                        <Field type="checkbox" name="isPublished" id='isPublished' />&nbsp;
                        <label className="form-label ml-2 mb-0" for="isPublished"> Published</label>
                        <ErrorMessage name="isPublished" component="div" className="invalid-feedback" />
                    </div>
                </div>
                {/* <div className='col-12 mt-3'>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <Field name="email" type="text" placeholder="Enter email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <Field name="email" type="text" placeholder="Enter email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>
                </div> */}
                <div className='d-flex justify-content-end pt-4'>
                    <button type="submit" disabled={props.actionsLoading} className="btn btn-primary">
                        {props.actionsLoading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        {
                            props.isEdit ? 'UPDATE PRODUCT' : 'ADD PRODUCT'
                        }
                    </button>
                </div>
            </Form>
       
            )}
            </Formik>
        
    )


}


export default ProductForm