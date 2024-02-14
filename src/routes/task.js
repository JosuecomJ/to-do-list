const express = require('express');

const checklistDependentRouter = express.Router();
const simpleRouter = express.Router();

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
simpleRouter.delete('/:id', async (req, res)=>{
    try {
        let task = await Task.findByIdAndDelete(req.params.id)
        let checklist = await Checklist.findById(task.checklist)
        let taskToremove = checklist.tasks.indexOf(task._id)
        checklist.tasks.splice(taskToremove, 1)
        await checklist.save()
        res.redirect(`/checklists/${checklist._id}`)
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Erro ao remover uma tarefa'})
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


module.exports = {
    ChecklistDependent: checklistDependentRouter,
    simple: simpleRouter
}