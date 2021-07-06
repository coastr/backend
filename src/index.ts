import express from 'express';
const app = express();
const port: number = 3001;

app.get('/', (_, res) => {
    res.status(200).send('Ok!!');
})

app.listen(port, () => console.log(`Running on port ${port}`));