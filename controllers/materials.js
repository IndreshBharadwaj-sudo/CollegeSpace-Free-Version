const Material = require('../models/material');
const Course = require('../models/courses');
const { cloudinary } = require('../cloudinary/index');
const User = require("../models/user");

module.exports.addMaterial = async (req, res) =>
{
    const course = await Course.findById(req.params.id);
    const material = new Material(req.body.material);
    material.author = (req.user._id);
    material.courseID = course._id;
    course.materials.push(material);
    await material.save();
    await course.save();
    req.flash('success', 'Successfully Added a new Material');
    res.redirect(`/courses/${course._id}`);
}

module.exports.deleteMaterial=async (req, res) =>
{
    const { id, materialId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { material: materialId } });
    const material = await Material.findById(materialId);
    await Material.findByIdAndDelete(materialId);
    req.flash('success', 'Successfully Deleted a Material');
    res.redirect(`/courses/${id}`);
}