
async function listSvc(req, res) {
  try {
    const workers = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(workers));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = {
  listSvc,
  registerSvc,
  removeSvc,
};
