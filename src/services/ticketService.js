import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Create a new ticket
export const createTicket = async (ticketData) => {
  try {
    const ticketRef = await addDoc(collection(db, 'tickets'), {
      ...ticketData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'Open',
      comments: [{
        id: Date.now().toString(),
        text: 'Ticket created',
        author: ticketData.createdBy,
        timestamp: serverTimestamp()
      }]
    });

    return { success: true, id: ticketRef.id };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { success: false, error: error.message };
  }
};

// Get all tickets
export const getAllTickets = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tickets'));
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, tickets };
  } catch (error) {
    console.error('Error getting tickets:', error);
    return { success: false, error: error.message };
  }
};

// Get tickets by user
export const getTicketsByUser = async (userId) => {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, tickets };
  } catch (error) {
    console.error('Error getting user tickets:', error);
    return { success: false, error: error.message };
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
    if (ticketDoc.exists()) {
      return { success: true, ticket: { id: ticketDoc.id, ...ticketDoc.data() } };
    } else {
      return { success: false, error: 'Ticket not found' };
    }
  } catch (error) {
    console.error('Error getting ticket:', error);
    return { success: false, error: error.message };
  }
};

// Update ticket
export const updateTicket = async (ticketId, updates) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating ticket:', error);
    return { success: false, error: error.message };
  }
};

// Delete ticket
export const deleteTicket = async (ticketId) => {
  try {
    await deleteDoc(doc(db, 'tickets', ticketId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return { success: false, error: error.message };
  }
};

// Add comment to ticket
export const addComment = async (ticketId, comment) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);
    
    if (!ticketDoc.exists()) {
      return { success: false, error: 'Ticket not found' };
    }

    const ticketData = ticketDoc.data();
    const newComment = {
      id: Date.now().toString(),
      text: comment.text,
      author: comment.author,
      timestamp: serverTimestamp()
    };

    const updatedComments = [...(ticketData.comments || []), newComment];

    await updateDoc(ticketRef, {
      comments: updatedComments,
      updatedAt: serverTimestamp()
    });

    return { success: true, comment: newComment };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message };
  }
};

// Get tickets by status
export const getTicketsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, tickets };
  } catch (error) {
    console.error('Error getting tickets by status:', error);
    return { success: false, error: error.message };
  }
};

// Get tickets by priority
export const getTicketsByPriority = async (priority) => {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('priority', '==', priority),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, tickets };
  } catch (error) {
    console.error('Error getting tickets by priority:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listener for tickets
export const subscribeToTickets = (callback) => {
  const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    callback(tickets);
  });
};

// Real-time listener for user tickets
export const subscribeToUserTickets = (userId, callback) => {
  const q = query(
    collection(db, 'tickets'),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    callback(tickets);
  });
};

// Search tickets
export const searchTickets = async (searchTerm) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tickets'));
    const tickets = [];
    querySnapshot.forEach((doc) => {
      const ticket = { id: doc.id, ...doc.data() };
      if (
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        tickets.push(ticket);
      }
    });
    return { success: true, tickets };
  } catch (error) {
    console.error('Error searching tickets:', error);
    return { success: false, error: error.message };
  }
}; 