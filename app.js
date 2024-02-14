const express = require('express')
const path = require('path')

const checklistRouter = require('./src/routes/checklist.js') 
const taskRouter = require('./src/routes/task.js') 
const rootRouter = require('./src/routes/index') 
require('./src/config/database.js')
const methodOverrride = require('method-override')

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(methodOverrride('_method', {
    methods: ['POST', 'GET']
}))

app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine','ejs');

app.use('/', rootRouter)
app.use('/checklists',checklistRouter)
app.use('/checklists',taskRouter.ChecklistDependent)
app.use('/tasks',taskRouter.simple)

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})