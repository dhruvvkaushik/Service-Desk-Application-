import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

  useEffect(() => {
    // Load tickets from localStorage
    const storedTickets = localStorage.getItem('serviceDeskTickets');
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      // Initialize with sample tickets
      const sampleTickets = [
        {
          id: '1',
          title: 'Network Connectivity Issue',
          description: 'Unable to connect to the office network. Getting timeout errors.',
          category: 'IT Support',
          priority: 'High',
          status: 'Open',
          createdBy: 'John Doe',
          assignedTo: null,
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString(),
          comments: [
            {
              id: '1',
              text: 'Ticket created',
              author: 'John Doe',
              timestamp: new Date('2024-01-15').toISOString()
            }
          ]
        },
        {
          id: '2',
          title: 'Software Installation Request',
          description: 'Need Adobe Creative Suite installed on my workstation.',
          category: 'Software',
          priority: 'Medium',
          status: 'In Progress',
          createdBy: 'Jane Smith',
          assignedTo: 'Admin User',
          createdAt: new Date('2024-01-14').toISOString(),
          updatedAt: new Date('2024-01-16').toISOString(),
          comments: [
            {
              id: '1',
              text: 'Ticket created',
              author: 'Jane Smith',
              timestamp: new Date('2024-01-14').toISOString()
            },
            {
              id: '2',
              text: 'Software will be installed by end of day',
              author: 'Admin User',
              timestamp: new Date('2024-01-16').toISOString()
            }
          ]
        }
      ];
      setTickets(sampleTickets);
      localStorage.setItem('serviceDeskTickets', JSON.stringify(sampleTickets));
    }
    setLoading(false);
  }, []);

  const createTicket = (ticketData) => {
    const newTicket = {
      id: uuidv4(),
      ...ticketData,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [
        {
          id: uuidv4(),
          text: 'Ticket created',
          author: ticketData.createdBy,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    localStorage.setItem('serviceDeskTickets', JSON.stringify(updatedTickets));
    return newTicket;
  };

  const updateTicket = (id, updates) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === id) {
        return {
          ...ticket,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('serviceDeskTickets', JSON.stringify(updatedTickets));
  };

  const addComment = (ticketId, comment) => {
    const newComment = {
      id: uuidv4(),
      text: comment.text,
      author: comment.author,
      timestamp: new Date().toISOString()
    };

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          comments: [...ticket.comments, newComment],
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('serviceDeskTickets', JSON.stringify(updatedTickets));
  };

  const getTicketById = (id) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const getTicketsByUser = (userId) => {
    return tickets.filter(ticket => ticket.createdBy === userId);
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
    getTicketsByUser,
    getTicketsByStatus
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}; 