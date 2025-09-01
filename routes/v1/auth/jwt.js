const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy; //Estratégia de auth via Jason Web Token.
const ExtractJwt = require('passport-jwt').ExtractJwt; //Esse é um utilitátio qua sabe onde buscar o token na requisição(Nesse caso no header);

const { Usuario } = require('../../../models');

passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Extrai o token JWT do cabeçalho da requisição
        secretOrKey: process.env.JWT_SECRET_KEY
    }, async (jwtPayload, done) => { //Função de verificação.
        try {
            const usuario = await Usuario.findById(jwtPayload.id);
            done(null, usuario); //se usuário encontrato
            
        } catch (error) { //se usuário não encontrado
            done(error)
        }
    }
))