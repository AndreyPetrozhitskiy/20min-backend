const express = require('express')
const path = require('path');
const userRouter = require('./routes/user.routes.js')
const projectsRouter = require('./routes/projects.routes.js')
const membersRouter = require('./routes/projectMembers.routes.js')
const rootRouter = require('./routes/rootUser.routes.js')
const cors = require('cors');
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors());
app.use(express.json())
app.use('/api/users', userRouter); 
app.use('/api/root', rootRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/role', membersRouter);

// Обработка статических файлов
app.use('/files', express.static(path.join(__dirname, 'files')));
const start = () => {
    try {
        app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))
    } catch (e) {
        console.log(e)
    }

}
start()