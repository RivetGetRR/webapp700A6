//As recommended by linked Code in assignment
//Same code as assignment 2 as recommended in the instructions
/*const fs = require('fs');

class Data{
    students;
    courses;

    constructor(students, courses){
        this.students = students;
        this.courses = courses
    }
}

var dataCollection = null; if there are errors, refer to assignment 5 code
*/

const Sequelize = require('sequelize');
var sequelize = new Sequelize('krsvmexk', 'krsvmexk', '56yI0SnkoA9ypGBXmfJanbwqJTL99Ulb', {
    host: 'lallah.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    },
    query:{ raw: true }
});

var Student = sequelize.define('Student', {
    studentNum:{ 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: { 
        type: Sequelize.INTEGER,
        primaryKey: true ,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, {foreignKey: 'course'});

//
module.exports.initialize = function(){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(()=>{
            resolve();
        }).catch(errorMessage=>{
            reject(errorMessage);
        })
    });
}

module.exports.getAllStudents = function(){
    return new Promise(function(resolve,reject){
        Student.findAll().then((studentData)=>{
            resolve(studentData);
        }).catch((errorMessageS)=>{
            reject(errorMessageS);
        });
    });
}
/*
module.exports.getTAs = function(){
    return new Promise(function(resolve,reject){
        Student.findAll({
            WHERE: {TA: true}
        }).then((studentData)=>{
            resolve(studentData);
        }).catch((errorMessageS)=>{
            reject(errorMessageS);
        });
    });
}
*/
module.exports.getCourses = function(){
    return new Promise(function(resolve,reject){
        Course.findAll().then((courseData)=>{
            resolve(courseData);
        }).catch((errorMessageC)=>{
            reject(errorMessageC);
        });
    });
}
//copy pasted from above modules previously made by me - ask about this
module.exports.getStudentsByCourse = function(courseId){
    return new Promise(function(resolve,reject){
        Student.findAll({
            where: { course: courseId}
        }).then((studentData)=>{
            resolve(studentData);
        }).catch((errorMessageS)=>{
            reject(errorMessageS);
        });
    });
}

//issue with data retrival -> undefined but not undefined -> refer assignemnet 2 test?
module.exports.getStudentByNum = function(num){
    return new Promise(function(resolve,reject){
        Student.findAll({
            where: { studentNum: num}
        }).then((studentData)=>{
            resolve(studentData[0]);
        }).catch((errorMessageS)=>{
            reject(errorMessageS);
        });
    });
}

//Get Course by Id
module.exports.getCourseById = function(id){
    return new Promise(function(resolve,reject){
        Course.findAll({
           where: { courseId: id}
        }).then((courseData)=>{
            resolve(courseData[0]);
        }).catch((errorMessageC)=>{
            reject(errorMessageC);
        });
    });
}

module.exports.addStudent = function(studentData){
    return new Promise(function(resolve,reject){
        studentData.TA = (studentData.TA) ? true : false;
        for (const field in studentData) {
            if(studentData[field] == ""){
                studentData[field] = null;
            }
        }
        Student.create(studentData).then(()=>{
            resolve();
        }).catch((errorMessageS)=>{
            reject(errorMessageS);
        });
    });
}

module.exports.addCourse = function(courseData){
    return new Promise(function(resolve,reject){
        for (const field in courseData) {
            if(courseData[field] == ""){
                courseData[field] = null;
            }
        }
        Course.create(courseData).then(()=>{
            resolve();
        }).catch((errorMessageC)=>{
            reject(errorMessageC);
        });
    });
}

module.exports.updateStudent = function(studentData){
    return new Promise(function(resolve,reject){
        studentData.TA = (studentData.TA) ? true : false;
        for (const field in studentData) {
            if(studentData[field] == ""){
                studentData[field] = null;
            }
        }
        Student.update(studentData, {
           where: {studentNum: studentData.studentNum}
          }).then(()=>{
            resolve();
          }).catch(errorMessageS=>{
            reject(errorMessageS);
          });
    });
}

module.exports.updateCourse = function(courseData){
    return new Promise(function(resolve,reject){
        for (const field in courseData) {
            if(courseData[field] == ""){
                courseData[field] = null;
            }
        }
        Course.update(courseData, {
            where: {courseId: courseData.courseId}
          }).then(()=>{
            resolve(courseData);
          }).catch(errorMessageC=>{
            reject(errorMessageC);
          });
    });
}

module.exports.deleteStudentByNum = function(num){
    return new Promise(function(resolve,reject){
        Student.destroy({
           where: {studentNum: num}
          }).then(()=>{
            resolve();
          }).catch(errorMessageDS=>{
            console.log(errorMessageDS);
            reject(errorMessageDS);
          });
    });
}

module.exports.deleteCourseById = function(id){
    return new Promise(function(resolve,reject){
        Course.destroy({
            where: {courseId: id}
          }).then(()=>{
            resolve();
          }).catch(errorMessageDC=>{
            reject(errorMessageDC);
          });
    });
}