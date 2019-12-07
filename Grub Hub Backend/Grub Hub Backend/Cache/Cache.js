var sessionStorage = require('sessionstorage')

const cache=(req,res,next)=>{
    console.log('url->'+req.url);
    console.log('host->'+req.headers.host);
    if(sessionStorage.getItem('items')!=null){
        console.log('found in cache')
        let items = sessionStorage.getItem('items');
        res.json(items);
    }
    next();
}

module.exports=cache;