// const express = require("express");
// const fs = require("fs");
import express from "express";
import fs from "fs";
const app = express();

app.use(express.json());

// get method, endpoint"/" controller()=>{}
app.get("/", (req, res) => {
    res.status(200).send("First Express Project Todo App or CRUD Operations")
})

app.post("/add", (req, res) => {
    try {
        const newTodo = {//acces the data from body
            id: req.body.id,
            title: req.body.title,
            date: new Date(),
            isComplete: req.body.isComplete,
        }

        //converting to filedate from buffer-string-object
        let fileData = fs.readFileSync("./db.json").toString()//read the file / access data from file
        fileData = JSON.parse(fileData);
        fileData.todos.push(newTodo);
        fs.writeFileSync("./db.json", JSON.stringify(fileData))//write the file/add in file

        res.status(201).send({ newTodo, message: "to successfully created!" })//send resp to client,201 new resourse createed
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 400,
            message: "Can not create todo",
            error
        });
    }
})

//get one todo based on id
app.get("/gettodo/:id", (req, res) => {
    try {
        const id = req.params.id;
        const fileData = JSON.parse(fs.readFileSync("./db.json").toString())
        // console.log(fileData);
        let todo = fileData.todos.find((obj) => obj.id == id);
        if (todo) {

            res.status(200).send({ status: 200, todo: todo, message: `todo with id ${id} fetch successfully` })
        }
        else {

            res.status(400).send({ status: 400, message: `todo with id ${id} not exist!` })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ status: 400, message: "can not get todo!", error })
    }
})

//get all todo
app.get("/gettodo", (req, res) => {
    try {
        const fileData = JSON.parse(fs.readFileSync("./db.json").toString());
        console.log(fileData, fileData.todos)
        res.status(200).send({ status: 200, message: "successfully fetched all todos!", todos: fileData.todos })
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: "failed to fetch all todos!", error });
    }
})

//put m all resourse updated,

app.put("/updateTodo", (req, res) => {
    try {
        const todoId = req.body.id;
        const updatedTodo = req.body;
        const fileData = JSON.parse(fs.readFileSync("./db.json").toString());

        const todos = fileData.todos;
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == todoId) {
                todos[i] = { ...todos[i], ...updatedTodo };
                break;
            }
        }
        // console.log(fileData)
        fs.writeFileSync("./db.json", JSON.stringify(fileData));
        res.status(200).send({ status: 200, message: "successfully update the todo!", updatedTodo })

    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: "failed to update todo!", error });
    }
})

//but patch m specific key 
app.patch("/updateTodo", (req, res) => {
    try {
        const todoId = req.body.id;
        const fileData = JSON.parse(fs.readFileSync("./db.json").toString());

        const todos = fileData.todos;
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == todoId) {
                // if (req.body.title) {
                //     todos[i].title = req.body.title;
                // }
                // if (req.body.isComplete) {
                //     todos[i].isComplete = req.body.isComplete;
                // }
                for (let key in req.body) {
                    todos[i][key] = req.body[key];
                }
                break;
            }
        }
        // console.log(fileData)
        fs.writeFileSync("./db.json", JSON.stringify(fileData));
        res.status(200).send({ status: 200, message: "successfully update the todo!", updatedTodo: req.body })

    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: "failed to update todo!", error });
    }
})

app.delete("/deleteTodo/:id", (req, res) => {
    try {
        let todoId = req.params.id;
        //read the file data
        let fileData = JSON.parse(fs.readFileSync('./db.json').toString());
        // console.log(fileData)
        let todos = fileData.todos
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == todoId) {
                todos.splice(i, 1);
            }
        }
        fs.writeFileSync("./db.json", JSON.stringify(fileData))
        res.status(200).send({ status: 200, message: `todo with id ${todoId} successfully deleted!`, id: todoId })

    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: "Failed to delete todo!", error });

    }
})

app.listen(8000, () => {
    console.log("server is running on PORT:", 8000)
})






// console.log(JSON.stringify(fileData));
// {
//     "todos":
//     [
//         {
//             "id": 1,
//             "title": "task 1",
//             "date": "2023-11-28T14:51:12.482Z",
//             "isComplete": false
//         }
//     ]
// }