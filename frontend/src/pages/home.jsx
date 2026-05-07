// reactbits
import { BlurText } from "../reactbits"

// auth
import { useToken } from "../auth/AuthProvider"

// router
import { Link } from "react-router"

// icons
import { FileText, LogIn, UserPlus, Upload } from "lucide-react"

function Home() {
    const { token } = useToken()

    if (token) {
        return (
            <div>
                <div className="hero">
                    <BlurText
                        text="Your files, everywhere."
                        delay={120}
                        animateBy="words"
                        direction="top"
                    />
                    <p>Access, share, and manage your files from anywhere.</p>
                    <div className="hero-actions">
                        <Link to="/file" className="btn btn-primary"><FileText size={18} /> My Files</Link>
                        <Link to="/file/create" className="btn"><Upload size={18} /> Upload New</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="hero">
                <BlurText
                    text="Passion Project"
                    delay={150}
                    animateBy="words"
                    direction="top"
                />
                <p>Secure file storage and sharing, simplified.</p>
                <div className="hero-actions">
                    <Link to="/signup" className="btn btn-primary"><UserPlus size={18} /> Get Started</Link>
                    <Link to="/login" className="btn"><LogIn size={18} /> Log in</Link>
                </div>
            </div>

            <div className="action-grid">
                <Link to="/signup" className="card action-card">
                    <UserPlus className="icon" size={40} />
                    <h3>Create an account</h3>
                    <p>Sign up in seconds and start uploading your files.</p>
                </Link>
                <div className="card action-card">
                    <Upload className="icon" size={40} />
                    <h3>Upload files</h3>
                    <p>Drag and drop or select files to upload securely.</p>
                </div>
                <div className="card action-card">
                    <FileText className="icon" size={40} />
                    <h3>Share with others</h3>
                    <p>Invite collaborators with viewer or editor permissions.</p>
                </div>
            </div>
        </div>
    )
}

export default Home
