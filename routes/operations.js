const express = require("express");

const path = require("path");

const router = express.Router();

const fs = require("fs");

const dataPath = path.join(__dirname, "../data.json");

// returns JSON array of data.
router.get('/', (req, res) =>
{
    res.status(200).json(getParsedData());
});

// returns specific record from the data based on the 'id' sent through parametrs. (READ)
router.get('/read/:id', (req, res) =>
{
    let data = getParsedData();

    let record = data.find(record => record.id === parseInt(req.params.id));

    record ? res.status(200).json(record) : res.sendStatus(404);
});

// add a new record to the data. (CREATE)
router.post("/add", (req, res) =>
{
    let data = getParsedData();
    let newId = data.length + 1;

    let newRecord = {
        "id": newId,
        "firstName": req.body.firstName || null,
        "lastName": req.body.lastName || null,
        "email": req.body.email || null,
        "gender": req.body.gender || null,
        "designation": req.body.designation || null,
        "department": req.body.department || null
    }

    data.push(newRecord);
    saveJSONData(data);

    res.sendStatus(204);
})

// updates a record present in the database.
router.patch("/update/:id", (req, res) =>
{
    let data = getParsedData();

    let recordIndex = data.findIndex(record => record.id === parseInt(req.params.id));

    if (recordIndex > -1)
    {
        let record = data[recordIndex];
        for(prop in req.body){
            record[prop] = req.body[prop];
        }
        saveJSONData(data);
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(404);
    }
})

// delete a record from the data. (DELETE)
router.delete("/delete/:id", (req, res) =>
{
    let data = getParsedData();

    let recordIndex = data.findIndex(record => record.id === parseInt(req.params.id));

    if (recordIndex > -1)
    {
        data.splice(recordIndex, 1);
        saveJSONData(data);
        res.sendStatus(204)
    } else
    {
        res.sendStatus(404);
    }
})

// Assigns cases to the specified employee
router.patch('/:assignedCaseId&:employeeId', (req, res) => {
    let data = getParsedData();

    let recordIndex = data.findIndex(record => record.id === parseInt(req.params.employeeId));

    if(recordIndex > -1)
    {
        data[recordIndex].assignedCases.push(req.params.assignedCaseId);
        saveJSONData(data);
        res.sendStatus(204);
    }
    else{
        res.status(404).send("Employee not found");
    }
})

function getParsedData()
{
    let data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

function saveJSONData(data)
{
    fs.writeFileSync(dataPath, JSON.stringify(data));
}

module.exports = router;
