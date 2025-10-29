# Holidaze - Venue Booking Platform

A modern accommodation booking platform built with React, allowing users to browse and book venues, and venue managers to list and manage their properties.

## Description

Holidaze is a comprehensive booking application that connects travelers with accommodation providers. The platform offers two user experiences:

**For Customers:**

- Browse and search through available venues
- View detailed venue information including amenities, location, and availability
- Create and manage bookings
- Update profile avatar

**For Venue Managers:**

- Create and list venues with detailed descriptions and images
- Manage venue details and pricing
- View and track bookings for their properties
- Update venue information and availability

## Built With

- [React](https://reactjs.org/) - UI Framework
- [React Router](https://reactrouter.com/) - Navigation and routing
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Noroff API v2](https://docs.noroff.dev/docs/v2) - Backend API

## Getting Started

### Installing

1. Clone the repository:

```bash
git clone https://github.com/KariannNor/holidaze.git
```

2. Navigate to the project directory:

```bash
cd holidaze
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory and add your API key:

```
REACT_APP_API_KEY=your_api_key_here
```

### Running

To run the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

To build for production:

```bash
npm run build
```

## Features Implemented

### User Stories Completed

✅ **Public Features:**

- View list of all venues
- Search for specific venues by name or location
- View detailed venue page with images, amenities, and location
- View available dates for booking (via booking form)

✅ **Customer Features:**

- Register with @stud.noroff.no email
- Login/logout functionality
- Create bookings at venues
- View upcoming and past bookings
- Update profile avatar

✅ **Venue Manager Features:**

- Register as venue manager
- Create new venues with details, images, and amenities
- Update existing venues
- Delete managed venues
- View all bookings for managed venues

### Technical Implementation

**Best Practices:**

- Clean, modular JavaScript code following React best practices
- Reusable components with proper prop validation
- Error-free code with comprehensive error handling
- Formatted with consistent code style
- Semantic HTML structure
- Accessible form inputs with proper labels and validation
- WCAG compliant color palette
- Responsive design for all screen sizes

**User Experience:**

- User-friendly error messages and feedback
- Form validation with helpful error messages
- Loading states for async operations
- Success confirmations for user actions
- Intuitive navigation with clear call-to-actions
- Accessible UI components

**Design:**

- Modern, clean interface appealing to travelers
- Consistent color scheme with blue primary color (#2563eb)
- Responsive grid layouts adapting to all devices
- Clear visual hierarchy and spacing
- Professional typography and imagery

## Project Structure

```
src/
├── api/              # API integration and constants
│   ├── auth/         # Authentication endpoints
│   ├── bookings/     # Booking endpoints
│   ├── profile/      # Profile endpoints
│   └── venues/       # Venue endpoints
├── components/       # Reusable React components
│   ├── auth/         # Login and registration forms
│   ├── bookings/     # Booking components
│   ├── common/       # Shared components (Loading, SearchBar)
│   ├── layout/       # Layout components (Header, Footer)
│   ├── profile/      # Profile components
│   └── venues/       # Venue components
├── context/          # React context (AuthContext)
├── pages/            # Page components
├── utils/            # Utility functions (storage helpers)
└── App.jsx           # Main application component
```

## API Integration

The application integrates with the [Noroff API v2](https://docs.noroff.dev/docs/v2/holidaze/venues) for:

- User authentication and registration
- Venue CRUD operations
- Booking management
- Profile management

## Contact

[Kariann Norheim](https://github.com/KariannNor)

## Acknowledgments

- [Noroff School of Technology and Digital Media](https://www.noroff.no/) for project requirements
- [Noroff API Documentation](https://docs.noroff.dev/) for API reference
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Note:** This project was created as part of the Project Exam 2 for the Noroff Front-End Development course.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
