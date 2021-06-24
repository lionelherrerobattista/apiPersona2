require('dotenv').config();
require('./mongo');
const express = require('express');
const cors = require('cors');
const { handlerNotFound } = require('./middlewares');
const Persona = require('./models/Persona');


const PORT = process.env.PORT || 3000;
const app = express();
// const logger = (req, res, next) => {
//     console.log(`Hay ${personas.length} personas en la lista`);
//     next();
// }

// const personas = [
//     {id:1, nombre:"Juan", edad:30},
//     {id:2, nombre:"Analía", edad:24},
//     {id:3, nombre:"Daniela", edad:27},
//     {id:4, nombre:"Martín", edad:25 },
// ];

app.use(express.json());
app.use(cors());
// app.use(logger);

app.get("/", (req, res) => {
    res.send("<h1>API PERSONAS</h1>");
});

app.get("/api/personas", (req, res, next) => {
   Persona.find({}).then((personas) => {
       res.json(personas);
   })
   .catch(err => {
       next(err);
   })
});

app.get("/api/personas/:id", (req, res, next) => {
    const id = req.params.id;
    Persona.findById(id)
    .then(persona => {
        if(persona){
            res.json(persona); //actua como un return
        }     
        res.status(404).end();
    })
    .catch(err => {
        next(err);
    });
    
});

app.delete("/api/personas/:id", (req, res, next) => {
    const id = req.params.id;

    Persona.findByIdAndRemove(id)
    .then(result => {
        if(result){
            res.status(204).end();
        }
        res.status(404).end();
    })
    .catch(err => {
        next(err);
    });
});

app.post('/api/personas', (req, res, next) => {
    const {nombre, edad} = req.body;

    if(nombre && edad) {
        //Construyo una persona
        const nuevaPersona = new Persona({
            nombre,
            edad
        });

        nuevaPersona.save()
        .then(persona => {
            res.json(persona);
        })
        .catch(err => {
            next(err);
        })
    } else {
        res.status(400).send({error: "Parametros inválidos"});
    }
});

app.put('/api/personas/:id', (req, res, next) => {
    const id = req.params.id;
    const {nombre, edad} = req.body;
    const infoPersona = {};

    //Filtrar por si falta algún dato
    if(nombre) {
        infoPersona.nombre = nombre;
    }
    if(edad) {
        infoPersona.edad = edad;
    }

    Persona.findByIdAndUpdate(id, infoPersona, {new:true})
    .then(personaModificada => {
        if(personaModificada) {
            res.json(personaModificada);
        }
        res.status(400).end();
    })
    .catch(err =>{
        next(err);
    })
});

app.use(handlerNotFound);

//Manejar errores con middleware
app.use((error, req, res, next) => {
    console.log(error.name);
    if(error.name === 'CastError') {
        res.status(400).send({error: "Invalid id"});
    } else if(error.name === 'SyntaxError') {
        res.status(400).send({error: "Syntax error"});
    }else{
        res.status(500).send({error: "Internal server error"});
    }
    next(error);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});