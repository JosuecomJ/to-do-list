const express = require('express');

const checklistDependentRouter = express.Router();

const Checklist = require('../models/checklist');
const Task = require('../models/task');



checklistDependentRouter.get('/:id/tasks/new' , async (req, res) => {
    try {
        let task = Task()
        res.status(200).render('tasks/new', {checklistId: req.params.id, task: task})
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao carregar o formulario'})
    }
})

checklistDependentRouter.post('/:id/tasks', async (req, res)=>{
    let {name} = req.body.task;
    let task = new Task({name, checklist: req.params.id})
    try {
        await task.save()
        let checklist = await Checklist.findById(req.params.id)
        checklist.tasks.push(task)
        await checklist.save()
        res.redirect(`/checklists/${req.params.id}`)
    } catch (error) {
        let errors = error.errors
        res.status(422).render('task/new', {task: {...task,  errors}, checklistId: req.params.id})
    }
})


module.exports = {ChecklistDependent: checklistDependentRouter}