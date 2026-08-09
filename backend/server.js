const express = require('express');  //importa o Express que foi instalado
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('./prismaClient');
const authMiddleware = require('./authMiddleware');

const app = express();
const PORT = 3000;
const SECRET  = 'minha_chave_secreta_temporaria';

app.use(express.json());

app.get('/', (req, res) =>{         //Define a rota 
    res.send('Servidor rodando!');
});

app.post('/register', async (req, res) =>{
    try{
        const {email, senha} = req.body;

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const user = await prisma.user.create({
            data: {
                email: email,
                senha: senhaCriptografada,
            },
        });

        res.status(201).json({id: user.id, email: user.email});
    } catch (error) {
        res.status(400).json({ erro: 'Erro ao criar usuário', detalhes: error.message});
    }
});

app.post('/login', async (req, res) =>{
    try {
        const {email, senha} = req.body;

        const user = await prisma.user.findUnique({ where: {email}});

        if(!user){
            return res.status(400).json({ erro: 'Usuário não encontrado'});
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if(!senhaValida){
            return res.status(400).json({erro: 'Senha incorreta'});
        }

        const token = jwt.sign({userId: user.id}, SECRET, {expiresIn: '1h'});

        res.json({token});
    } catch (error){
        res.status(400).json({erro: 'Erro ao fazer login', detalhes: error.message});
    }
});


//Create com authMiddler
app.post('/tasks', authMiddleware, async (req, res)=>{
    try{
        const {titulo, status} = req.body;
        console.log('req.userId dentro da rota:', req.userId);

        const tasks = await prisma.task.create({
            data: {
                titulo: titulo,
                status: status || 'pendente',
                userId: req.userId,
            },
        })
        res.status(201).json(tasks);
    } catch(error){
        res.status(400).json({erro: 'Erro ao criar tarefa', detalhes: error.message});
    }
});

//FindMany Listar tarefas
app.get('/tasks', authMiddleware, async (req, res)=>{
    try{
        const tasks = await prisma.task.findMany({
            where: {userId: req.userId},
        });
        res.json(tasks);
    } catch (error){
        res.status(400).json({erro: 'Erro ao lista de tarefas', datalhes: error.message});
    }
});

//Update, Editar/concluir tarefa
app.put('/tasks/:id', authMiddleware, async (req, res)=>{
    try{
        const {id} = req.params;
        const {titulo, status} = req.body;

        const tasks = await prisma.task.update({
            where: {
                id: Number(id),
                userId: req.userId,
            },
            data: {
                titulo,
                status,
            },
        });
        res.json(tasks);
    } catch(error){
        res.status(400).json({erro: 'Erro ao atualizar tarefa', detalhes: error.message});
    }
});

//Delete, deletar tarefa
app.delete('/tasks/:id', authMiddleware, async (req, res)=>{
    try {
        const {id} = req.params;

        await prisma.task.delete({
            where: {
                id: Number(id),
                userId: req.userId,
            },
        });

        res.status(204).send();
    } catch (error) {
        res.status(400).json({erro: 'Erro ao excluir tarefa', detalhes: error.message});
    }
});

app.listen(PORT, () => {           //Faz o servidor escutar requisições na porta 3000
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});