// importando o framework express
const express = require('express');

// cookies e sessions
const session = require('express-session');
const cookieParser = require('cookie-parser');

// iniciar o express
const app = express();

const PORT = 3000;

// configurando o uso da biblioteca do cookie
app.use(cookieParser());

// middleware para análise de formulários
app.use(express.urlencoded({ extended: true }));

// configurar a sessão
app.use(session({
    secret: 'minhachave', // chave secreta para os cookies
    resave: false, // evita regravar as sessões que não se alteram
    saveUninitialized: true, // salvar as sessões anônimas.
    cookie: { secure: false } // Defina como 'true' se estiver usando HTTPS
}));

// dados de exemplo
const lista_de_acesso = [
    { usuario: 'Usuario 1', senha: ('123') },
    { usuario: 'Usuario 2', senha: ('345') }
];

// rota de login (para o formulário)
app.get('/login', (req, res) => {
    res.send(`
        <h1> Login </h1>

        <form method="POST" action="/login">
            <input type="text" name="usuario" placeholder="Usuario" required/>
            <input type="password" name="senha" placeholder="Senha" required/>
            <button type="submit">Entrar</button>
        </form>`);
});

// rota de login (para autenticação)
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    const usuarioEncontrado = lista_de_acesso.find(u => u.usuario === usuario && u.senha === senha);

    if (usuarioEncontrado){
        req.session.estaAutenticado = true;
        req.session.usuario = usuario;
        res.redirect('/protegida');
    } else {
        res.status(401).send('Usuário ou Senha Inválidos');
    }
});

// rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send('Erro ao sair');
        res.redirect('/login');
    });
});

// middleware de autenticação
function estaAutenticado (req, res, next) {
    if (req.session.estaAutenticado) {
        return next ();
    } else {
        res.redirect('/login');
    }
}

// rota protegida
app.get('/protegida', estaAutenticado, (req, res) => {
    res.send(`Bem Vindo ${req.session.usuario}!
        <a href="/logout">Sair</a>`);
});


app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});