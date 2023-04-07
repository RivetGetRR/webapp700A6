/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Rahul Pankaja Edirisinghe Student ID: 133360222 Date: 24/03/2023 March 24th 2023
*
* Online (Cyclic) Link: https://busy-crab-fedora.cyclic.app/
*
********************************************************************************/


var express = require("express");
var path = require("path");
const moduleAccess = require('./modules/collegeData');
const exphbs = require("express-handlebars");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;


//Main Paths 
//Get Students
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers:{
        //Taken from assignment Instructions--------
        navLink: function(url, options){
            return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
        //-----------------------------------------
    }
}));
app.set("view engine", ".hbs");

//Taken from assignment Instructions--------
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
    next();
   });
//-----------------------------------------

app.get("/students", (req, res) => {
    
    let response = undefined;

    if(req.query.course){//has course param:
        if(req.query.course <= 11 && req.query.course >= 1){
            moduleAccess.getStudentsByCourse(req.query.course).then(function(studentData){
                console.log("Successfully retrieved " + (studentData.length) + " students");
                //res.json(studentData);
                //if(studentData.length > 0){
                    res.render("students", {student: studentData});
                //}else{
                //    res.render("students",{ message: "no results" });
                //}
            }).catch(errorMessageS=>{
                console.log(errorMessageS);
                //res.json({message: errorMessageS});
                res.render("students", {message: errorMessageS});
            });
        }else{
            res.json({message: "Enter Valid Course Number: 1-11"});
        }
    }else{//if no param then: 
 
        moduleAccess.getAllStudents().then(function(studentData){
            console.log("Successfully retrieved " + (studentData.length) + " students");
            //res.json(studentData);
            if(studentData.length > 0){
                res.render("students", {student: studentData});
            }else{
                res.render("students",{ message: "no results" });
            }
        }).catch(errorMessageS=>{
            console.log(errorMessageS);
            //res.json({message: errorMessageS});
            res.render("students", {message: errorMessageS});
        });
    }
});

//Students by Num
/*
app.get("/student/:num", (req, res) => {
    moduleAccess.getStudentByNum(req.params.num).then(function(studentData){
        console.log("Successfully retrieved " + (studentData.firstName + " " + studentData.lastName + " " + studentData.course));
        //res.json(studentData);
        res.render("student", {student: studentData});
    }).catch(errorMessageS=>{
        console.log(errorMessageS);
        //res.json({message: errorMessageS});
        res.render("student", {message: errorMessageS});
    });
});
*/
//Below code taken from Assignment Instructions--
app.get("/student/:studentNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    moduleAccess.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        }else{
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error 
    }).then(moduleAccess.getCourses).then((data) => {
        viewData.courses = data; // store course data in the "viewData" object as "courses"
        // loop through viewData.courses and once we have found the courseId that matches
        // the student's "course" value, add a "selected" property to the matching 
        // viewData.courses object
        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.courses = []; // set courses to empty if there was an error
    }).then(() => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    });
});
//-----------------------------------------------------------

//Courses by ID
app.get("/course/:id", (req, res) => {
    moduleAccess.getCourseById(req.params.id).then(function(courseData){
        //The requirements for this: 404
        if(courseData != undefined && courseData != null){
            console.log("Successfully retrieved " + (courseData.courseId + "-" + courseData.courseCode + " " + courseData.courseDescription));
            res.render("course", {course: courseData});
        }else{
            res.status(404).send({message: "Course Not Found"});
        }
    }).catch(errorMessageC=>{
        console.log(errorMessageC);
        //res.json({message: errorMessageS});
        res.render("course", {message: errorMessageC});
    });
});

//
app.get("/courses", (req, res) => {
    moduleAccess.getCourses().then(function(courseData){
        console.log("Successfully retrieved " + (courseData.length) + " courses");
        //res.json(courseData);
        if(courseData.length > 0){
            res.render("courses", {course: courseData});}
        else{
            res.render("courses",{ message: "no results" });
        }
    }).catch(errorMessageC=>{
        console.log(errorMessageC);
        //res.json({message: errorMessageC});
        res.render("courses", {message: errorMessageC});
    });
});

//HTML Paths
//node --watch server.js
app.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/home.html"));
    res.render("home");
});

app.get("/about", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/about.html"));
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
    res.render("htmlDemo");
});

app.get("/students/add", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/addStudent.html"));
    moduleAccess.getCourses().then(function(courseData){
        res.render("addStudent",{courses: courseData});
    }).catch(errorMessageCAS=>{
        res.render("addStudent",{courses: []});
    });
});

app.post("/students/add", (req, res) => {
    //res.json(req.body);
    moduleAccess.addStudent(req.body).then(function(studentData){
        console.log("Successfully added new Student");
        //var path = "/student/" + Data;
        //res.redirect(path);
        res.redirect("/students");
    }).catch(errorMessageAS=>{
        console.log(errorMessageAS);
        res.json({message: errorMessageAS});
    });
});

app.post("/student/update", (req, res) => {
    console.log(req.body);
    //req.json()  
    moduleAccess.updateStudent(req.body).then(function(studentData){
        console.log("Successfully updated " + (studentData) + "'s data");
        //res.json(studentData);
        res.redirect("/students");
        //res.render("student", {student: studentData});
    }).catch(errorMessageUS=>{
        console.log(errorMessageUS);
        //res.json({message: errorMessageC});
        res.render("student", {message: errorMessageUS});
    });
});

app.get("/student/delete/:num", (req, res) => {
    moduleAccess.deleteStudentByNum(req.params.num).then(function(){
        console.log("Successfully Deleted Student " + req.params.num);
        res.redirect("/students");
    }).catch(errorMessageDS=>{
        console.log(errorMessageDS);
        res.status(500).send({message: "Unable to Remove Student / Student not found: " + errorMessageDS});
    });
});

app.get("/courses/add", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/addStudent.html"));
    res.render("addCourse");
});

app.post("/courses/add", (req, res) => {
    //res.json(req.body);
    moduleAccess.addCourse(req.body).then(function(Data){
        console.log("Successfully added new Course");
        //var path = "/student/" + Data;
        //res.redirect(path);
        res.redirect("/courses");
    }).catch(errorMessageAC=>{
        console.log(errorMessageAC);
        res.json({message: errorMessageAC});
    });
});

app.post("/course/update", (req, res) => {
    console.log(req.body);
    //req.json()  
    moduleAccess.updateCourse(req.body).then(function(courseData){
        console.log("Successfully updated " + (courseData.courseCode) + "'s data");
        res.redirect("/courses");
        //
    }).catch(errorMessageUC=>{
        console.log(errorMessageUC);
        res.render("course", {message: errorMessageUC});
    });
});

app.get("/course/delete/:id", (req, res) => {
    moduleAccess.deleteCourseById(req.params.id).then(function(){
        console.log("Successfully Deleted Course " + req.params.id);
        //res.render("course", {course: courseData});
        res.redirect("/courses");
    }).catch(errorMessageDC=>{
        console.log(errorMessageDC);
        res.status(500).send({message: "Unable to Remove Course / Course not found: " + errorMessageDC});
    });
});

//Server Initialization and Error Handling
app.use((req,res,next)=>{
    //
    res.status(404).render("E404");
});

// setup http server to listen on HTTP_PORT
moduleAccess.initialize().then(function(returnedData){//create an object and use that? is this beacuse of local saved files?
    app.listen(HTTP_PORT, ()=>{console.log("Server listening on port: " + HTTP_PORT)});
}).catch(errorMessage=>{
    console.log(errorMessage);
});


