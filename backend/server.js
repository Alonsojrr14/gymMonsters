require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = 3001;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB Atlas!'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/gymMonsters', express.static(path.join(__dirname, 'gymMonsters')));

// Configuração do GymMonsters como objeto JS
const GymMonsters = {
  Trembomon: 'Trembomon',
  Duramon: 'Duramon',
  Acetamon: 'Acetamon',
};

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Cadeia evolutiva flexível
const evolutionChains = {
  base: [
    { level: 5, monster: 'Cutemon', img: '/gymMonsters/1_cutemon.png' },
    { level: 20, monster: 'Leomon', img: '/gymMonsters/2_leomon.png' },
    { level: 40, monster: 'Trebomon', img: '/gymMonsters/3_Trebomon.png' }
  ]
};

function getLevelFromXP(xp) {
  return Math.floor(xp / 225) + 1;
}

function tryEvolveMonster(usuario) {
  // Só evolui se estiver na cadeia base
  if (!usuario.monster || usuario.monster === 'gymMonsterBase' || usuario.monster === 'Cutemon' || usuario.monster === 'Leomon') {
    const chain = evolutionChains.base;
    const level = getLevelFromXP(usuario.exp);
    // Se não tem monster, começa com o base
    if (!usuario.monster) {
      usuario.monster = 'gymMonsterBase';
      usuario.monsterImg = '/gymMonsters/0_gymMonsterBase.png';
    }
    // Evolui para o estágio mais avançado possível
    let lastStage = { monster: 'gymMonsterBase', img: '/gymMonsters/0_gymMonsterBase.png' };
    for (let i = 0; i < chain.length; i++) {
      if (level >= chain[i].level) {
        lastStage = chain[i];
      }
    }
    if (usuario.monster !== lastStage.monster) {
      usuario.monster = lastStage.monster;
      usuario.monsterImg = lastStage.img;
      return true;
    }
  }
  return false;
}

// Rota de login
app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  const usuario = await User.findOne({ user, password });
  if (usuario) {
    tryEvolveMonster(usuario);
    await usuario.save();
    return res.json({ success: true, monster: usuario.monster, monsterImg: usuario.monsterImg });
  }
  res.status(401).json({ success: false, message: 'Credenciais inválidas' });
});

// Rota para escolher o GymMonster
app.post('/choose-monster', async (req, res) => {
  const { user, monster } = req.body;
  if (!Object.values(GymMonsters).includes(monster)) {
    return res.status(400).json({ success: false, message: 'GymMonster inválido' });
  }
  const usuario = await User.findOne({ user });
  if (!usuario) return res.status(404).json({ success: false });
  usuario.monster = monster;
  await usuario.save();
  res.json({ success: true });
});

// Rota para adicionar treino
app.post('/add-workout', upload.single('photo'), async (req, res) => {
  const { user, duration, calories } = req.body;
  const usuario = await User.findOne({ user });
  if (!usuario) return res.status(404).json({ success: false });
  if (!duration) return res.status(400).json({ success: false, message: 'Duração obrigatória' });
  // Se for o primeiro treino e o usuário está com o ovo, choca o ovo
  if (usuario.monster === "egg" && usuario.workouts.length === 0) {
    usuario.monster = "gymMonsterBase";
    usuario.monsterImg = "/gymMonsters/0_gymMonsterBase.png";
  }
  const durationMin = parseInt(duration);
  const durationHours = durationMin / 60;
  const caloriesNum = calories ? parseInt(calories) : 1;
  const exp = Math.round(durationHours * caloriesNum);
  usuario.exp += exp;
  tryEvolveMonster(usuario);
  const workout = {
    duration: durationMin,
    calories: caloriesNum,
    photo: req.file ? `/uploads/${req.file.filename}` : null,
    exp,
    date: new Date().toISOString(),
  };
  usuario.workouts.push(workout);
  await usuario.save();
  res.json({ success: true, exp: usuario.exp, workout, monster: usuario.monster, monsterImg: usuario.monsterImg });
});

// Rota para obter dados do usuário
app.get('/get-user', async (req, res) => {
  const { user } = req.query;
  const usuario = await User.findOne({ user });
  if (!usuario) return res.status(404).json({ success: false });
  // Ordena os treinos do mais recente para o mais antigo
  const workoutsOrdenados = (usuario.workouts || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({
    user: usuario.user,
    monster: usuario.monster,
    monsterImg: usuario.monsterImg,
    exp: usuario.exp,
    workouts: workoutsOrdenados,
  });
});

// Rota de cadastro de usuário
app.post('/register', async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ success: false, message: 'Usuário e senha obrigatórios' });
  }
  const usuarioExistente = await User.findOne({ user });
  if (usuarioExistente) {
    return res.status(409).json({ success: false, message: 'Usuário já existe' });
  }
  const novoUsuario = new User({
    user,
    password,
    monster: "egg",
    monsterImg: "/gymMonsters/egg.gif",
    exp: 0,
    workouts: [],
  });
  await novoUsuario.save();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 