import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTickets } from '../../contexts/TicketContext';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Edit,
  Send
} from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getTicketById, updateTicket, addComment } = useTickets();
  const [ticket, setTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const foundTicket = getTicketById(id);
    if (foundTicket) {
      setTicket(foundTicket);
      setEditData({
        status: foundTicket.status,
        priority: foundTicket.priority,
        assignedTo: foundTicket.assignedTo || ''
      });
    }
  }, [id, getTicketById]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'Resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleStatusChange = async (newStatus) => {
    if (!ticket) return;
    
    setLoading(true);
    try {
      updateTicket(ticket.id, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!ticket) return;
    
    setLoading(true);
    try {
      updateTicket(ticket.id, editData);
      setTicket({ ...ticket, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !ticket) return;

    setLoading(true);
    try {
      addComment(ticket.id, {
        text: newComment,
        author: user.name
      });
      setNewComment('');
      // Refresh ticket data
      const updatedTicket = getTicketById(id);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Ticket not found</h2>
          <p className="mt-2 text-gray-600">The ticket you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/tickets')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              <p className="text-gray-600">Ticket #{ticket.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {getStatusIcon(ticket.status)}
              <span className="ml-1">{ticket.status}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              {user.role === 'admin' && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>
            
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Category:</span>
                <p className="text-gray-900">{ticket.category}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Created:</span>
                <p className="text-gray-900">{formatDate(ticket.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Last Updated:</span>
                <p className="text-gray-900">{formatDate(ticket.updatedAt)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Created By:</span>
                <p className="text-gray-900">{ticket.createdBy}</p>
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          {user.role === 'admin' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Controls</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To
                    </label>
                    <input
                      type="text"
                      value={editData.assignedTo}
                      onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter assignee name"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Quick Status Update:</span>
                    <div className="flex space-x-2">
                      {['Open', 'In Progress', 'Resolved'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={loading || ticket.status === status}
                          className={`px-3 py-1 text-xs font-medium rounded-md ${
                            ticket.status === status
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {ticket.assignedTo && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Assigned to:</span>
                      <p className="text-gray-900">{ticket.assignedTo}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            </div>
            
            {/* Add Comment */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </button>
              </div>
            </form>
            
            {/* Comments List */}
            <div className="space-y-4">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-indigo-200 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm text-gray-900">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Updated:</span>
                <span className="text-sm text-gray-900">{formatDate(ticket.updatedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Created by:</span>
                <span className="text-sm text-gray-900">{ticket.createdBy}</span>
              </div>
              {ticket.assignedTo && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Assigned to:</span>
                  <span className="text-sm text-gray-900">{ticket.assignedTo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/tickets')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                ← Back to Tickets
              </button>
              <button
                onClick={() => navigate('/tickets/new')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                + Create New Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail; 