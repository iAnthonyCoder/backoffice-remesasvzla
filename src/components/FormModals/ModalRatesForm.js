// import { Card, CardBody, Col, Container, Row, Modal, Button, ModalHeader, ModalBody, Alert } from "reactstrap"
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';


// const ModalRatesForm = (props) => {

//     const onSubmit = async (fields, {setStatus, setSubmitting}) => {
//         setSubmitting(true)
//         try {
//             let payload = []
//             console.log(fields)
//             Object.keys(fields).map(x => {
               
//                 payload.push({
//                     product: x,
//                     value: fields[x]
//                 })
//             })
//             await bulkUpdateProducts({
//                 rates:payload,
//                 date: new Date().toISOString(),
//                 note: ''
//             })
//             props.toggle()
//             props._getProducts()

//         } catch(er) {
//             console.log(er)
//         }
//     }
   
//     return (
//         <Modal
//             isOpen={props.isOpen} 
//             toggle={props.toggle}
//         > 
//         {console.log(props)}
//             <ModalHeader toggle={props.toggle} tag="h4">
//                 Update Rates
//             </ModalHeader>
//             <ModalBody> 
//             <Formik initialValues={props.initialValues}  enableReinitialize={true} onSubmit={onSubmit}>
//         {({ errors, touched, isSubmitting, setFieldTouched, handleChange, setFieldValue, values }) => (
          
//             <Form className="signup-form">
//                 {
//                     props.products.map(x => 
//                         <div className='col-12'>
//                             <div className="form-group">
//                                 <label className="form-label">{`${x.currency_to_receive.iso_code}/${x.currency_to_deliver.iso_code}${x.cash_deliver ? ' (EFE)' : ''}`}</label>
//                                 <Field name={x._id} type="number" placeholder={"Enter "+`${x.currency_to_receive.iso_code}/${x.currency_to_deliver.iso_code}${x.cash_deliver ? ' (EFE)' : ''}`} className={'form-control' + (errors[x._id] && touched[x._id] ? ' is-invalid' : '')} />
//                                 <ErrorMessage name={x._id} component="div" className="invalid-feedback" />
//                             </div>
//                             <br/>
//                         </div>
//                     )
//                 }
//                 <div className='d-flex justify-content-end pt-4'>
//                     <button type="submit" disabled={isSubmitting} className="btn btn-primary">
//                         {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
//                         {
//                             'UPDATE RATES'
//                         }
//                     </button>
//                 </div>
//             </Form>
//             )}
//             </Formik>
                
//             </ModalBody>
//         </Modal>
//     )
// }

// export default ModalRatesForm