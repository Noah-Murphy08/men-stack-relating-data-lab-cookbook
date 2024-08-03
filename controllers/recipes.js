const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');



router.get('/', async (req, res) => {
    try {
        res.locals.populatedRecipes = await Recipe.find({}).populate('owner')
        if (req.session.user) {
            res.locals.userRecipes = await Recipe.find({ owner: req.session.user._id }).populate('owner')
        } else {
            res.locals.userRecipes = [];
        }

        res.render('recipes/index.ejs')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/new', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({})
        res.render('recipes/new.ejs', {
            ingredients
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/:recipeId', async (req, res) => {
    try {
        const populatedRecipes = await Recipe.findById(req.params.recipeId).populate('owner').populate('ingredients')
        res.locals.recipe = populatedRecipes
        res.render('recipes/show.ejs', {
            recipe: populatedRecipes
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/:recipeId/edit', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({})
        const currentRecipe = await Recipe.findById(req.params.recipeId)
        res.render('recipes/edit.ejs', {
            recipe: currentRecipe,
            ingredients
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.put('/:recipeId', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({})
        const currentRecipe = await Recipe.findById(req.params.recipeId)
        await currentRecipe.updateOne(req.body)
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.post('/', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body)
        newRecipe.owner = req.session.user._id
        await newRecipe.save()
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.delete('/:recipeId', async (req, res) => {
    try {
        const usedRecipe = await Recipe.findById(req.params.recipeId)
        await usedRecipe.deleteOne()
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }

})

// router.put('/:ingedientId', async (req, res) => {
//     try {
//         const currentRecipe = await Ingredient.findById(req.params.ingredientId)
//         res.redirect('/recipes')
//     } catch (error) {
//         console.log(error)
//         res.redirect('/')
//     }
// })





module.exports = router;