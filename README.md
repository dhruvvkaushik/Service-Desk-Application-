# Service Desk Application

A comprehensive service desk platform built with React that allows users to raise tickets for various issues or requests, with user registration, login system, and administrative ticket management capabilities.

## 🚀 Features

### User Features
- **User Registration & Login**: Secure authentication system with personalized access
- **Ticket Creation**: Raise tickets with detailed descriptions, priority levels, and categories
- **Ticket Tracking**: Monitor the status of submitted tickets in real-time
- **Ticket Updates**: Receive notifications and updates on ticket progress
- **Comment System**: Add additional information and communicate with support team
- **Responsive Design**: Seamless experience across all devices

### Admin Features
- **Admin Panel**: Comprehensive dashboard for ticket management
- **Ticket Assignment**: Assign tickets to specific team members
- **Status Management**: Update ticket status (Open, In Progress, Resolved)
- **Priority Management**: Set and modify ticket priority levels
- **Advanced Filtering**: Filter tickets by status, priority, category, and assignee
- **Search Functionality**: Search across all tickets and users

### Technical Features
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant status updates and notifications
- **Local Storage**: Data persistence using browser storage
- **Route Protection**: Secure routes with authentication guards

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.22.0
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Build Tool**: Vite 7.0.3
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd service-desk-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 🔐 Demo Credentials

### User Account
- **Email**: user@example.com
- **Password**: password

### Admin Account
- **Email**: admin@example.com
- **Password**: admin

## 📱 Usage Guide

### For Users

1. **Registration/Login**
   - Visit the application and click "Sign up" to create a new account
   - Or use the demo credentials to log in

2. **Creating a Ticket**
   - Navigate to "New Ticket" from the dashboard
   - Fill in the ticket details:
     - Title: Brief description of the issue
     - Category: Select appropriate category (IT Support, Software, Hardware, etc.)
     - Priority: Choose urgency level (Low, Medium, High, Critical)
     - Description: Provide detailed information about the issue

3. **Tracking Tickets**
   - View all your tickets in the "My Tickets" section
   - Click on any ticket to see detailed information
   - Add comments to provide additional context
   - Monitor status updates in real-time

### For Administrators

1. **Admin Panel Access**
   - Log in with admin credentials
   - Access the "Admin Panel" from the navigation menu

2. **Ticket Management**
   - View all tickets across the organization
   - Filter tickets by status, priority, category, or assignee
   - Search for specific tickets or users
   - Update ticket status and assign tickets to team members

3. **Quick Actions**
   - Change ticket status with one click
   - Assign tickets to specific team members
   - Monitor critical and high-priority tickets
   - Track unassigned tickets

## 🎨 UI Components

### Authentication Pages
- **Login Page**: Clean login form with email/password fields
- **Register Page**: User registration with validation
- **Password Visibility Toggle**: Show/hide password functionality

### Dashboard
- **Statistics Cards**: Overview of ticket counts and status
- **Quick Actions**: Easy access to create new tickets
- **Recent Tickets**: List of recent tickets with status indicators

### Ticket Management
- **Ticket Form**: Comprehensive form for creating new tickets
- **Ticket List**: Filterable and sortable ticket table
- **Ticket Detail**: Detailed view with comments and admin controls

### Admin Panel
- **Overview Statistics**: Key metrics and performance indicators
- **Advanced Filters**: Multiple filter options for ticket management
- **Bulk Operations**: Efficient ticket management tools

## 🔧 Configuration

### Environment Variables
The application uses local storage for data persistence. In a production environment, you would want to:

1. Set up a backend API
2. Configure environment variables for API endpoints
3. Implement proper authentication with JWT tokens
4. Set up a database for ticket storage

### Customization
- **Colors**: Modify the Tailwind configuration in `tailwind.config.js`
- **Categories**: Update the categories array in `TicketForm.jsx`
- **Priorities**: Modify priority levels in the ticket components
- **Statuses**: Add or modify ticket statuses in the context

## 📊 Data Structure

### Ticket Object
```javascript
{
  id: "unique-id",
  title: "Ticket Title",
  description: "Detailed description",
  category: "IT Support",
  priority: "High",
  status: "Open",
  createdBy: "User Name",
  assignedTo: "Admin Name",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z",
  comments: [
    {
      id: "comment-id",
      text: "Comment text",
      author: "User Name",
      timestamp: "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### User Object
```javascript
{
  id: 1,
  name: "User Name",
  email: "user@example.com",
  role: "user" // or "admin"
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **File Attachments**: Support for file uploads in tickets
- **Email Notifications**: Automated email alerts for ticket updates
- **Advanced Reporting**: Analytics and reporting dashboard
- **Multi-language Support**: Internationalization (i18n)
- **Dark Mode**: Theme switching capability
- **Mobile App**: React Native version
- **API Integration**: Backend API with database
- **User Roles**: More granular permission system
- **Ticket Templates**: Predefined ticket templates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React and Tailwind CSS**
