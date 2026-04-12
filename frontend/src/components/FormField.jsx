function FormField({ inputType, inputPlaceholder, labelText, inputId, onChange }) {
    return <div className="form-field">
        <label htmlFor={inputId} >{labelText}</label>
        <input id={inputId} type={inputType} placeholder={inputPlaceholder} onChange={onChange} />
    </div>
}

export default FormField
