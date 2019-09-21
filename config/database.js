if(process.env.NODE_ENV === 'production')
{
  module.exports = {mongoURI:'mongodb://remah amr:remah654312@ds133875.mlab.com:33875/vidjot-prod'}
}
else {
  module.exports = {mongoURI:'mongodb://localhost/vidjot-dev'}
}
//module.exports = {mongoURI:'mongodb://localhost/vidjot-dev'}
