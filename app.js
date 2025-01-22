// const express = require('express')

// const app =express()

// const expenses=[{
//     id:1,
//     title:"Food",
//     amount:200
// },{
//     id:2,
//     title:"Truf",
//     amount:500
// },
// ]

// app.get('/api/expenses',(req,res)=>{
//     // console.log(req.query)
//     res.status(200).json(expenses)
// })

// app.get('/api/expenses/:id',(req,res)=>{
//     const { id }=req.params;
//     const expense = expenses.find((expense)=>expense.id == id);
//     if(!expense){
//         res.status(404).json({message:"Not Found"});
//         return
//     }
//     res.status(200).json(expense);
// })


// app.listen(3000,()=>{
//     console.log('Server is running on http://localhost:3000');
// })




// const express = require('express')

// const app =express()

// const expenses=[{
//     id:1,
//     title:"Food",
//     amount:200
// },{
//     id:2,
//     title:"Truf",
//     amount:500
// },
// ]

// app.get('/api/expenses',(req,res)=>{
//      console.log(req.query)
//     res.status(200).json(expenses)
// })

// app.get('/api/expenses/:id',(req,res)=>{
//     const { id }=req.params;
//     const expense = expenses.find((expense)=>expense.id == id);
//     if(!expense){
//         res.status(404).json({message:"Not Found"});
//         return
//     }
//     res.status(200).json(expense);
// })


// app.listen(3000,()=>{
//     console.log('Server is running on http://localhost:3000');
// })



import express from 'express'
import mongoose from 'mongoose'
const app = express()
app.use(express.json());
import { v4 as uuidv4 } from 'uuid';

mongoose.connect("mongodb://localhost:27017/expenses").then(() => {
    console.log("Connected to MongoDB");
});

const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: String, required: true }
})

const Expense = mongoose.model("Expense", expenseSchema);

// const expenses=[{
//     id:1,
//     title:"Food",
//     amount:200
// },{
//     id:2,
//     title:"Truf",
//     amount:500
// },
// ]

app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        if (!expenses) {
            res.status(404).json({ message: "No Expenses Found" });
        }
        //console.log(req.query)
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

app.get('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOne({ id });
        if (!expense) {
            res.status(404).json({ message: "Not Found" });
            return
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})
app.post("/api/expenses", async (req, res) => {
    //console.log(req.body);
    try {
        const { title, amount } = req.body;
        if (!title || !amount) {
            res.status(400).json({ message: "Title and Amount are required" });
            return;
        }
        const newExpense = new Expense({
            id: uuidv4(),
            title,
            amount
        })
        const savedExpense = await newExpense.save()
        res.status(201).json(savedExpense);
        res.end();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findOneAndDelete({ id });
        if (!deletedExpense) {
            res.status(404).json({ message: "Expense Not Found" });
            return;
        }
        res.status(200).json({ message: "Expense Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
)


app.put("/api/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount } = req.body;

        if (!title && !amount) {
            res.status(400).json({ message: "No fields to update provided" });
            return;
        }


        const updatedExpense = await Expense.findOneAndUpdate(
            { id },
            { $set: { title, amount } },
            { new: true }
        );


        if (!updatedExpense) {
            res.status(404).json({ message: "Expense not found" });
            return;

        }

        res.status(200).json({ message: "Expense updated successfully", updatedExpense });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



// app.put("/api/expenses/:id",async(req,res)=>{
//     const {id}=req.params;
//     const {title,amount}=req.body;
//     try{
//         const updatedExpense= await Expense.findOneAndUpdate({id},{title,amount},{new:true});
//         if(!updatedExpense){
//             res.status(404).json({message:"Expense Not Found"});
//             return;
//         }
//         res.status(200).json({message:"Expense Updated Successfully"});
//     }catch(error){
//         res.status(500).json({message:"Internal Server Error"});
//     }
// })

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})




