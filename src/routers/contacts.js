import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getAllContactController, getContactByIdController, createContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";

const router = Router();

router.get('/', ctrlWrapper(getAllContactController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', ctrlWrapper(createContactController));

router.patch('/:contactId', ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;