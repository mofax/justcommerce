import { FormState } from "react-hook-form/dist/types";

interface FormErrorTextProps {
    formState: FormState<any>
    field: string
    className?: string
}

function FormErrorText(props: FormErrorTextProps) {
    const error = props.formState.errors[props.field];
    if (error && error.message) {
        return <span className={`form-error-text text-red`}>{error.message}</span>
    }
    return null;
}

export default FormErrorText;