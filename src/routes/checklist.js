const express = require('express')  
const router = express.Router()

const Checklist = require('../models/checklist.js')
const checklist = require('../models/checklist.js')
const { render } = require('ejs')

router.get("/", async (req,res)=>{
        try {
            let checklists = await Checklist.find({})
            res.status(200).render('checklists/index', {checklists: checklists})
        } catch (error) {
            res.status(500).render('pages/error', {error: error})
        }
    })

router.get("/new", async (req,res)=>{
  try {
    let checklists = new Checklist()

    res.status(200).render('checklists/new', {checklists: checklists})
  } catch (error) {
    res.status(500).render('pages/error', {error: error.message})
  }
})
    

router.post("/", async  (req,res)=>{
    let {name} = req.body.checklists
    let checklist = new Checklist({name})
    try {
        await checklist.save()
        res.redirect('/checklists')
        console.log(checklist);
    } catch (error) {
        res.status(422).render('checklists/new', {checklists: {...req.body.checklists, error}})
    }
})


router.get("/:id/edit", async(req,res)=>{
  try {
  let checklists = await Checklist.findByIdAndUpdate(req.params.id)
  res.status(200).render('checklists/edit', {checklists: checklists})
} catch (error) {
  res.status(422).json({error: error.message})
}
  
})


router.get("/:id", async (req,res)=>{
  try {
    let checklist = await Checklist.findById(req.params.id).populate('tasks').exec();
    res.status(200).render('checklists/show', {checklist: checklist})
  } catch (error) {
    res.status(422).render('pages/error', {error: error})
  }
})




router.put("/:id", async(req,res)=>{
  let {name} = req.body.checklists
  try {
    let checklist = await Checklist.findByIdAndUpdate(req.params.id, {name}, {new: true})
    res.status(200).redirect(`/checklists/`)
  } catch (error) {
    res.status(422).json({error: error.message})
  }
})

router.delete("/:id", async (req,res)=>{
  try{
    let checklist = await Checklist.findByIdAndDelete(req.params.id)
    res.redirect('/checklists')
  }catch (error) {
  res.status(500).render('pages/error')
  }
})

module.exports = router