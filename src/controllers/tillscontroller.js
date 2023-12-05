import {prisma } from '../db.js'
import paginateAndSortResults from '../utilities/pagination.js';
import softDelete from '../utilities/softDelete.js';


const getAllTills = async(req,res)=>{
    try {
        const { page = 1, pageSize = 10, sortBy = 'id', sortOrder = 'asc' } = req.query;        
        const types = await prisma.tills.findMany({
            where: { deletedAt: null }
        })
        const paginatedData = await paginateAndSortResults(prisma.tills,  Number(page), Number(pageSize), req.query.sortBy, req.query.sortOrder);
        // const paginatedData = paginateAndSortResults(tillsTypes, Number(page), Number(pageSize), sortBy, sortOrder);        
        res.json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: 'No se pudieron obtener registros.' });
    }
}
const createTills = async (req,res)=>{
    const type = await prisma.tills.create({
        data:{
            TILL_NAME:req.body.TILL_NAME,
            TILL_ACCOUNT_NUMBER:req.body.TILL_ACCOUNT_NUMBER,
            person_id: req.body.person_id,
            t_type_id: req.body.t_type_id
        }
    })
    res.json(type)
}

const showTills = async (req,res)=>{
    const type = await prisma.tills.findFirst({
        where:{
            id:parseInt(req.params.id),
            deletedAt:null
        }
    })
    res.json(type)
}

const updateTills = async (req,res)=>{
    const type = await prisma.tills.update({
        where:{
            id:parseInt(req.params.id)
        },
        data: req.body
        
    })
    res.json(type)
}

const deleteTills = async (req,res)=>{
    try {
        const typeId = parseInt(req.params.id);
        await softDelete(prisma.tills, { id: typeId });
        res.json({ message: 'Registro eliminado correctamente.' });
      } catch (error) {
        res.status(500).json({ error: 'No se pudo eliminar el registro.' });
      }
}

const searchTills = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'id', sortOrder = 'asc' } = req.query;        
        const tills = await prisma.tills.findMany({
        where: {
            TILL_NAME:{
            contains: req.query.TILL_NAME
            },
            deletedAt:null
        }
        });
        const paginatedData = await paginateAndSortResults(prisma.tills, Number(page), Number(pageSize),sortBy, sortOrder);
        res.json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: 'No se pudieron obtener los tipos de tills.' });
    }
  };


export {
    getAllTills,
    createTills,
    updateTills,
    deleteTills,
    showTills,
    searchTills
  };