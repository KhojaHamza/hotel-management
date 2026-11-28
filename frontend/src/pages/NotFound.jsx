import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1">404</h1>
      <p className="lead">Cette page n'existe pas.</p>
      <Link to="/" className="btn btn-primary">
        Retour au dashboard
      </Link>
    </div>
  )
}

export default NotFound