const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Course = require('../models/courses');
const courses = require('../controllers/courses');
const { courseSchema } = require('../schemas.js');
const { isLoggedIn,isAuthor,validateCourse } = require('../middleware');
const Material = require('../models/material');
const User = require('../models/user');
const mongoose = require('mongoose');
const { func } = require('joi');
const db = mongoose.connection;

router.post('/:id/search', async (req, res) =>
{
    req.body.id = req.params.id;
    const regex = new RegExp(req.body.search, 'i');
    const regex1 = new RegExp(req.body.id, 'i');
    var materials = Material.find({ description: regex , courseID: regex1}, (err, data) =>
    {
        if (err)
            console.log(err);
        else
        {
            res.render('courses/searchresult', { materials: data, id: req.params.id })
        }
    });
    // materials = JSON.stringify(materials);
    // console.log(Object.entries(materials));
    // res.render('courses/searchresult', { JSON.stringify(materials) });
})

router.get('/autocomplete/',function(req,res,next){
    const course_id=req.query.course_id;
    var regx=new RegExp(req.query["term"],'i');
    var materials=Material.find({description:regx,courseID:course_id},{'description':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    materials.exec(function(err,data){
        var result=[];
        if(!err)
        {
            if(data&&data.length&&data.length>0)
            {
                data.forEach(user=>{
                    let obj={
                        id:user._id,
                        label:user.description
                    };
                    result.push(obj);
                });
            }
            // console.log(result);
            res.jsonp(result);
        }
    });
    // next();
})


router.route('/')
.get(catchAsync(courses.index))
.post(isLoggedIn, validateCourse, catchAsync(courses.createCourse))

router.get('/new', isLoggedIn, catchAsync(courses.renderNewForm))

router.route('/:id')
    .get(catchAsync(courses.showCourse))
.put(isLoggedIn, isAuthor, validateCourse, catchAsync(courses.updateCourse))
.delete (isLoggedIn, isAuthor, catchAsync(courses.deleteCourse))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(courses.renderEditForm));



module.exports = router;