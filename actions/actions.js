const express = require('express')
const actions = require('../data/helpers/actionModel') 


const router = express.Router()

router.get('/', async (req, res, next) =>{
    try{
        const data = await actions.get()
        res.status(200).json(data)
    } catch(err) {
        next(err)
    }
})


router.get('/:id', validateActionId(), async (req, res, next) =>{
    try{
      const getById = await actions.get(req.params.id)
      res.status(201).json(getById)  
    } catch(err) {
        next(err)
    }
    
})

router.put('/:id', validateAction(), validateActionId(), async (req, res, next) =>{
    try{
      const update = await actions.update(req.params.id, req.body)
      res.status(201).json(update)  
    } catch(err) {
        next(err)
    }
    
})

router.delete('/:id', validateActionId(), async (req, res, next) =>{
    try{
      const remove = await actions.remove(req.params.id)
      res.status(201).json(remove)  
    } catch(err) {
        next(err)
    }
    
})




//middleWares

function validateActionId() {
	return async (req, res, next) => {
		try {
			const action = await actions.get(req.params.id)
			
			if (action) {
				req.action = action
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