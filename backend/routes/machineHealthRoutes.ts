import express, { Router } from 'express';
import { getMachineHealth } from '../machineHealth';
import validateToken from '../middleware/validateTokenHandler';
import MachineData from '../models/machineDataModel'

const machineHealthRouter = Router();

machineHealthRouter.post('/', validateToken, async (req: any, res) => {
    const result = getMachineHealth(req);

    for (const machine in result.machineScores) {
        const machineData = await MachineData.create({
            machine,
            score: result.machineScores[machine as keyof typeof result.machineScores],
            datapoints: req.body.machines[machine as keyof typeof result.machineScores],
            username: req.user.user.username,
            userId: req.user.user.id,
            date: Date.now()
          })
    }

    if (result.error) {
        return res.status(400).json(result);
    } else {
        return res.json(result);
    }
});

machineHealthRouter.get('/scores/:machine', validateToken, async (req, res) => {
    const machine = req.params.machine
    const machineData = await MachineData.find({machine}).sort({date: 'desc'});

    if (machineData) {
        console.log('bbb')

        return res.json(machineData);
    } else {
        console.log('aaa')
        return res.status(404);
    }
});

export default machineHealthRouter