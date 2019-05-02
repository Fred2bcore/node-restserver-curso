 const mongoose = require('mongoose');
 const uniqueValidator = require('mongoose-unique-validator');

 let rolesValidos = {
     values: ['ADMIN_ROLE', 'USER_ROLE'],
     message: '{VALUE} no es un rol valido'
 };

 let Schema = mongoose.Schema;

 let userSchema = new Schema({
     nombre: {
         type: String,
         required: [true, 'El nombre es necesario']
     },
     email: {
         type: String,
         unique: true,
         required: [true, 'El correo es necesario']
     },
     password: {
         type: String,
         required: [true, 'La contraseña es obligatoria']
     },
     img: {
         type: String,
         required: false
     },
     role: {
         type: String,
         default: 'USER_ROLE',
         enum: rolesValidos
     },
     estado: {
         type: Boolean,
         default: true
     },
     google: {
         type: Boolean,
         default: false
     }
 });

 userSchema.methods.toJSON = function() {
     let usuario = this;
     let usuarioObject = usuario.toObject();
     delete usuarioObject.password;

     return usuarioObject;
 }

 userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

 module.exports = mongoose.model('Usuario', userSchema);