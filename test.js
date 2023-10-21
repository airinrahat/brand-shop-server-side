app.get("/addtocart", async (req, res) => {
  console.log(req.query.email);
  let query = {};
  if (req.query?.email) {
    query = { email: req.query.email };
  }
  const result = await CartCollection.find(query).toArray();
  res.send(result);
});

const urls = `http://localhost:5000/addtocart?email=${user.email}`;
useEffect(() => {
  fetch(urls)
    .then((res) => res.json())
    .then((data) => setCarts(data));
}, [urls]);
