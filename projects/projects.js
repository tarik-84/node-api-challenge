const express = require('express')
const projects = require('../data/helpers/projectModel') 
const actions = require('../data/helpers/actionModel')


const router = express.Router()


router.get('/', async (req, res, next) =>{
    try {
        const data = await projects.get()
        res.status(200).json(data)
    } catch(err) {
        next(err)
    } 
})

router.get('/:id', validateProjectId(), async (req, res, next) =>{
    try {
        const getById = await projects.get(req.params.id)
        res.status(200).json(getById)
    } catch(err) {
        next(err)
    } 
})

router.post('/', validateProject(), async (req, res, next) => {
    try {
        const data = await projects.insert(req.body)
        res.status(201).json(data)
    } catch(err) {
        next(err)
    }
})

router.post('/:id/actions', validateAction(), validateProjectId(), async (req, res, next) => {
    try {
        const addAction = await actions.insert({...req.body, project_id: req.params.id})
        res.status(201).json(addAction)
    } catch(err) {
        next(err)
    }
})

router.put('/:id', validateProject(), validateProjectId(), async (req, res, next) => {
    try{
        const update = await projects.update(req.params.id, req.body)
        res.status(200).json(update)
    } catch(err) {
        next(err)
    }
})

router.delete('/:id', validateProjectId(), async (req, res, next) => {
    try{
        const remove = await projects.remove(req.params.id)
        res.status(200).json({
            message: 'The project has been removed'
        })
    } catch(err){
        next(err)
    }
})

router.get('/:id/actions', validateProjectId(), async (req, res, next) => {
    try{
        const getActions = await projects.getProjectActions(req.params.id)
        res.status(200).json(getActions)
    } catch(err) {
        next(err)
    }
})


//middleWares
function validateProjectId() {
	return async (req, res, next) => {
		try {
			const project = await projects.get(req.params.id)
			
			if (project) {
				req.project = project
				next()
			} else {
				res.status(404).json({
					message: "Could not find project",
				})
			}
		} catch (err) {
			next(err)
		}
    }
}

function validateProject() {
    return (req, res, next) => {
        if(!req.body.name || !req.body.description){
            return res.status(400).json({
              message: 'missing required name or description field'
            })
          }
          next()
    }
}

function validateAction() {
    return (req, res, next) => {
        if(!req.body.description || !req.body.notes){
            return res.status(400).json({
              message: 'missing required name or description field'
            })
          }
          next()
    }
}

module.exports = router;