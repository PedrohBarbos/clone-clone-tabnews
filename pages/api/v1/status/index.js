function status(request, response) {
  response
    .status(200)
    .json({ mensagem: "cara eu só quero testar a pontuação" });
}

export default status;
