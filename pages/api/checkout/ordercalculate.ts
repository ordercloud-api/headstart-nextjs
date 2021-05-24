export default (req, res) => {
  console.log('order calc hit', req.body)
  return res.status(200).send({
    TaxTotal: 12345,
  })
}
