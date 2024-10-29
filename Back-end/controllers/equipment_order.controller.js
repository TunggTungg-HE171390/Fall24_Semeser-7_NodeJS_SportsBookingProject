const db = require("../models");

async function findEquipmentOrder(req, res, next) {
    try {
        const equipment_order = await db.equipmentOrder.findById(req.params.id)
             .populate("equipments.equipmentId");

        console.log(equipment_order); 
        
        res.status(200).json(equipment_order.equipments.map(e => e.equipmentId.equipmentName));
    } catch (error) {
        next(error);
    }
}


const equipOrderController = {
    findEquipmentOrder
};

module.exports = equipOrderController;