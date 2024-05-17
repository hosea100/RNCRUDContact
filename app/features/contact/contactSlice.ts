import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

type Contact = {
  id?: string;
  firstName: string;
  lastName: string;
  age: string;
  photo: string;
};

type ContactState = {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
};

const initialState: ContactState = {
  contacts: [],
  loading: false,
  error: null,
};

// Async thunks for fetching, adding, updating, and deleting contacts
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async () => {
  const response = await axiosInstance.getRequest('https://contact.herokuapp.com/contact', {});
  return response.data;
});

export const addContact = createAsyncThunk('contacts/addContact', async (contact: Contact) => {
  const response = await axiosInstance.postRequest('https://contact.herokuapp.com/contact', contact);
  return response.data;
});

export const updateContact = createAsyncThunk('contacts/updateContact', async (contact: Contact) => {
  const response = await axiosInstance.putRequest(`https://contact.herokuapp.com/contact/${contact.id}`, contact);
  return response.data;
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id: string) => {
  await axiosInstance.deleteRequest(`https://contact.herokuapp.com/contact/${id}`);
  return id;
});

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<Contact[]>) => {
        state.contacts = action.payload;
        state.loading = false;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action: PayloadAction<Contact>) => {
        state.contacts.push(action.payload);
        state.loading = false;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<Contact>) => {
        const index = state.contacts.findIndex((contact) => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action: PayloadAction<string>) => {
        state.contacts = state.contacts.filter((contact) => contact.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default contactSlice.reducer;
