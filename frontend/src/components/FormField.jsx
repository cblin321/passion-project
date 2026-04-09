function FormField({ inputType, inputPlaceholder, inputId }) {
    return <div className="form-field">
        <label htmlFor={inputId} ></label>
        <input id={inputId} type={inputType} placeholder={inputPlaceholder} />
    </div>
}

export default FormField
