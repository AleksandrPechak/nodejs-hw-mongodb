import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = () => ContactsCollection.find();
export const getContactById = (contactId) => ContactsCollection.findById(contactId);
export const createContact = (contactData) => ContactsCollection.create(contactData);
export const patchContact = (contactId, contactData) => ContactsCollection.findByIdAndDelate(contactId, contactData);
export const deleteContact = (contactId) => ContactsCollection.findByIdAndDelate(contactId);
 