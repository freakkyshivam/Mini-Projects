import 'dotenv/config'
import express from 'express'

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get('/', (req,res)=>{
    res.json({
        success : true,
        msg : "Hello from backend"
    })
})

app.listen(PORT, ()=> console.log(`Server listen at http://localhost:${PORT}`));