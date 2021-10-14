import { SingleSelect } from 'components/Common/SingleSelect';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { getCurrencies } from 'helpers/fakebackend_helper';
import * as Yup from 'yup';




function ProductForm(props) {

    const initialValues = {
        name: '',
		rate: 0,
		currency_to_receive: '',
		currency_to_deliver: '',
    };

    

    const validationSchema = Yup.object().shape({

        name: Yup.string()
            .min(5, "Minimum 5 symbols")
 			.max(50, "Maximum 50 symbols")
            .required('Person name is required'),

        rate: Yup.number()
            .min(0.000000000000001, "Minimum 0.000000000000001")
 			.max(10000000000000000000000, "Maximum 10000000000000000000000")
            .required('Phone is required'),

        currency_to_receive: Yup.object()

            .required('currency_to_receive is required'),

        currency_to_deliver: Yup.object()
            .required('currency_to_receive is required'),
    
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        fields.currency_to_receive = fields.currency_to_receive._id
        fields.currency_to_deliver = fields.currency_to_deliver._id
        props.handleValidProductSubmit(null, fields)
    }

    return (

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting, setFieldTouched, handleChange, setFieldValue, values }) => (
            <Form className="signup-form">
                <div className='col-12'>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <Field name="name" type="text" placeholder="Enter name" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    <div className="form-group">
                        <label className="form-label">Rate</label>
                        <Field name="rate" type="number" placeholder="Enter rate" className={'form-control' + (errors.rate && touched.rate ? ' is-invalid' : '')} />
                        <ErrorMessage name="rate" component="div" className="invalid-feedback" />
                    </div>
                </div>
                <div className='col-12 mt-3'>
                    <div className="form-group">
						<SingleSelect
							value={values.currency_to_receive}
							onChange={setFieldValue}
							onBlur={setFieldTouched}
							error={errors.currency_to_receive}
							endPoint={getCurrencies}
							touched={touched.currency_to_receive}
							name={"currency_to_receive"}
							title={"Currency"}
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
							endPoint={getCurrencies}
							touched={touched.currency_to_deliver}
							name={"currency_to_deliver"}
							title={"Currency"}
							extraFilter={false}
                            extraQuery={false}
						/>
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
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        ADD PRODUCT
                    </button>
                </div>
            </Form>
       
            )}
            </Formik>
        
    )


}


export default ProductForm