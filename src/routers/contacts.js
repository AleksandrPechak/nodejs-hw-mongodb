import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
        getAllContactsController,
        getContactByIdController,
        addContactController,
        patchContactController,
        deleteContactController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', ctrlWrapper(addContactController));

router.patch('/:contactId', ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;