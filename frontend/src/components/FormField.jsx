function FormField({ containerProps = {}, labelProps = {}, inputProps = {}, inputType, inputPlaceholder, labelText, inputId, onChange }) {
    return <div  {...containerProps} className="form-field">
        <label {...labelProps} htmlFor={inputId} >{labelText}</label>
        <input {...inputProps} id={inputId} type={inputType} placeholder={inputPlaceholder} onChange={onChange} />
    </div>
}

export default FormField
