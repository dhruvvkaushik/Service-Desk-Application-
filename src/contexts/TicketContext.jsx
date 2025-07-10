import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  createTicket as createTicketService,
  getAllTickets,
  getTicketsByUser,
  getTicketById as getTicketByIdService,
  updateTicket as updateTicketService,
  addComment as addCommentService,
  subscribeToTickets,
  subscribeToUserTickets
} from '../services/ticketService';

const TicketContext = createContext();

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    // Subscribe to real-time ticket updates
    let unsubscribe;
    if (user.role === 'admin') {
      unsubscribe = subscribeToTickets((tickets) => {
        setTickets(tickets);
        setLoading(false);
      });
    } else {
      unsubscribe = subscribeToUserTickets(user.name, (tickets) => {
        setTickets(tickets);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const createTicket = async (ticketData) => {
    try {
      const result = await createTicketService(ticketData);
      return result;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return { success: false, error: error.message };
    }
  };

  const updateTicket = async (id, updates) => {
    try {
      const result = await updateTicketService(id, updates);
      return result;
    } catch (error) {
      console.error('Error updating ticket:', error);
      return { success: false, error: error.message };
    }
  };

  const addComment = async (ticketId, comment) => {
    try {
      const result = await addCommentService(ticketId, comment);
      return result;
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  };

  const getTicketById = async (id) => {
    try {
      const result = await getTicketByIdService(id);
      return result;
    } catch (error) {
      console.error('Error getting ticket:', error);
      return { success: false, error: error.message };
    }
  };

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const value = {
    tickets,
    loading,
    createTicket,
    updateTicket,
    addComment,
    getTicketById,
    getTicketsByUser: (userId) => tickets.filter(ticket => ticket.createdBy === userId),
    getTicketsByStatus
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}; 