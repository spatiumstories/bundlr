import express from 'express';
import multer from 'multer';
const  upload = multer({ dest: 'uploads/' });
import fs from 'fs';
import {upload2, upload3} from './arweave.js';

const app = express()
const port = 3000

app.get('/', async function(req, res) {
  res.send("ok");
});

app.post('/upload', upload.single('book'), async function (req, res, next) {
  console.log(req);
    let data = fs.readFileSync(req.file.path);

    let result = await upload3(data);

    // Cleanup uploads
    
    res.send(result);
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})