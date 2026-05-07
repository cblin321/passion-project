import { useState, useRef, useEffect } from "react"

function Popover({ trigger, children, menuClass }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open])

    return (
        <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
            <div onClick={() => setOpen(o => !o)}>{trigger({ open, setOpen })}</div>
            {open && (
                <div className={`popover-menu${menuClass ? ` ${menuClass}` : ""}`}>
                    {children(setOpen)}
                </div>
            )}
        </div>
    )
}

export default Popover
