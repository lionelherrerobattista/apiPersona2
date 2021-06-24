const mongoose = require('mongoose');

const {model, Schema} = mongoose;

const personaSchema = new Schema({
    nombre:String,
    edad: Number,
});

personaSchema.set('toJSON', {
    transform:((document, personaToJSON) => {
        personaToJSON.id = personaToJSON._id.toString();
        delete personaToJSON._id;
        delete personaToJSON.__v;
    })
})

const Persona = model('Persona', personaSchema);

module.exports = Persona;