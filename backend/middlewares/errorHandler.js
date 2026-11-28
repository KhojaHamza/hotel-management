function notFound(req, res) {
  res.status(404).json({ message: 'Route introuvable' });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
}

module.exports = { notFound, errorHandler };