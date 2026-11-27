import { Link } from 'react-router-dom'

function Unauthorized() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4">403</h1>
      <p className="lead">Vous n'avez pas accès à cette page.</p>
      <Link to="/" className="btn btn-primary">
        Retour au dashboard
      </Link>
    </div>
  )
}

export default Unauthorized