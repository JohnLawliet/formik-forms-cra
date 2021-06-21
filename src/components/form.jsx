import { FormControlLabel, Checkbox, Card, CardContent, TextField, Typography, MenuItem, FormGroup, Box, Button } from "@material-ui/core";
import {Form, Formik, Field, useField, ErrorMessage} from 'formik'
import { object, string, number, boolean, array, mixed } from 'yup'

const initialValues = {
    fullName: '',
    initialInvestment: undefined,
    investmentRisk: [],
    commentAboutInvestmentRisk: '',
    dependents: -1,
    acceptedTermsAndCondtions: false
}


// NOTE in select options, number gets converted to string by default
// acceptedTermsAndCondtions when checked becomes true by default
// useField can be used to extract the props of field and pass them onto another component eg:
// <Field name="investmentRisk" value="Medium" type="checkbox" />  <--- originally how <Field /> is used
// const [field] = useField({
// name:name,
//     type:'checkbox',
//     value: value
// })
// in the above when the field is passed as props to FormControlLabel (default way of getting a checkbox in material). The checkbox is rendered dynamically
// 

const FormDemo = () => {
    return (
        <Card>
            <CardContent>                   
                <Typography variant="h4">New Account</Typography>                
                <Formik 
                    validationSchema={
                        object({
                            fullName:string().required("Ya need to put in ur full name m8").min(2).max(100),
                            initialInvestment:number().required().min(100),
                            dependents:number().required().min(0).max(5),
                            acceptedTermsAndCondtions:boolean().oneOf([true]),
                            investmentRisk:array(string().oneOf(["High","Medium","Low"]).min(1)),
                            commentAboutInvestmentRisk:mixed().when('investmentRisk', {
                                is: investmentRisk => investmentRisk.find(selected => selected === "High"),
                                then: string().required().min(20).max(100),
                                otherwise: string().min(20).max(100)
                            })
                        })
                    }
                    initialValues={initialValues}
                    onSubmit={(values, formikHelpers) => {
                        return new Promise(res => 
                            // returning a promise that gets resolved after 5 secs. This is so that the submit button stays disabled for the time
                            // This is a feature of formik
                            setTimeout(() => {
                                console.log(values)
                                console.log(formikHelpers)
                                res()
                            }, 5000)    
                        )
                    }}
                >
                { ({values, errors, isSubmitting, isValidating}) => (
                    <Form>
                        <Box marginBottom={2}>
                            <FormGroup>
                                <Field name="fullName" as={TextField} label="Full Name"/>    
                                <ErrorMessage name="fullName"/>                
                            </FormGroup>
                        </Box>

                        <Box marginBottom={2}>
                            <FormGroup>
                                <Field name="initialInvestment" type="number" as={TextField} label="Initial Investment"/>        
                                <ErrorMessage name="initialInvestment"/>           
                            </FormGroup>
                        </Box>
                        

                        <Box marginBottom={2}>
                            <FormGroup>
                                <MyCheckbox name="investmentRisk" value="High" type="checkbox" label="High - Super Risky"/>
                                <MyCheckbox name="investmentRisk" value="Medium" type="checkbox"  label="Medium - Risky"/>
                                <MyCheckbox name="investmentRisk" value="Low" type="checkbox" label="Low - Safe"/> 
                                <ErrorMessage name="investmentRisk"/>                  
                            </FormGroup>
                        </Box>
                       
                        <Box marginBottom={2}>
                            <FormGroup>
                                <Field name="commentAboutInvestmentRisk" 
                                    as={TextField} 
                                    multiline
                                    rows={3}
                                    rowsMax={10}
                                    label ="Comments About Investment Risk"
                                />        
                                <ErrorMessage name="commentAboutInvestmentRisk"/>                
                            </FormGroup>
                        </Box>

                        <Box marginBottom={2}>
                            <FormGroup>
                                <Field name="dependents" as={TextField} select label ="Select No. of dependents">
                                    <MenuItem value={-1}>--Select--</MenuItem>
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Field>    
                                <ErrorMessage name="dependents"/>                        
                            </FormGroup>
                        </Box>   
                        
                        <Box marginBottom={2}>
                            <FormGroup>
                                <MyCheckbox name="acceptedTermsAndCondtions" type="checkbox" label="Accepted Terms And Condtions?"/>  
                                <ErrorMessage name="acceptedTermsAndCondtions"/>                         
                            </FormGroup>
                        </Box>  

                        <Button type="submit" disabled={isSubmitting || isValidating}>Submit</Button>
                        <pre>{JSON.stringify(errors, null, 4)}</pre>
                        <pre>{JSON.stringify(values, null, 4)}</pre>
                    </Form>
                    )
                }
                </Formik>            
            </CardContent>
        </Card>
    )
}

export default FormDemo

export const MyCheckbox = ({name, label, value}) => {
    const [field] = useField({
        name:name,
        type:'checkbox',
        value: value
    })

    return (
        <FormControlLabel 
            control={<Checkbox {...field}/>} 
            label={label} 
        /> 
    )
}