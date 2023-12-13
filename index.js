const express = require('express')
const userRouter = require('./routes/user.routes.js')
const projectsRouter = require('./routes/projects.routes.js')
const membersRouter = require('./routes/projectMembers.routes.js')


const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use('/api/users', userRouter); 
app.use('/api/projects', projectsRouter);
app.use('/api/role', membersRouter);

app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))