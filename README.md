# DOY! Food Delivery Application

![DOY Banner](https://via.placeholder.com/800x200?text=DOY!+Food+Delivery+Application) <!-- Bu satırı daha sonra gerçek bir ekran görüntüsüyle değiştirebilirsiniz -->

A full-stack food delivery application developed as a university team project. DOY! enables users to browse restaurants, place orders, and track deliveries in real-time.

## ✨ Features

- **Restaurant Discovery**: Browse and filter restaurants by cuisine, rating, and location
- **Menu Management**: View detailed menus with item descriptions, prices, and customization options
- **Order Tracking**: Real-time updates on order status and delivery progress
- **User Authentication**: Secure login and registration system with profile management
- **Payment Integration**: Multiple payment method support
- **Admin Dashboard**: Restaurant owners can manage menus, view orders, and update status
- **Responsive Design**: Optimized user experience across all device sizes

## 🛠️ Technologies

### Frontend
- React.js
- Redux for state management
- Material-UI and styled-components
- Axios for API requests
- React Router for navigation

### Backend
- Java Spring Boot
- Spring Security for authentication
- JPA/Hibernate for ORM
- RESTful API architecture

### Database
- PostgreSQL

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- Java JDK 11+
- PostgreSQL
- Maven

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/yourusername/DOY-Food-Delivery-Application.git
cd DOY-Food-Delivery-Application/frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd ../backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

## 📁 Project Structure
```
DOY-Food-Delivery-Application/
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   ├── src/                 # Source files
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
├── backend/                 # Java Spring backend
│   ├── src/                 # Source files
│   │   ├── main/
│   │   │   ├── java/        # Java code
│   │   │   │   ├── controllers/  # REST controllers
│   │   │   │   ├── models/       # Data models
│   │   │   │   ├── repositories/ # Data repositories
│   │   │   │   └── services/     # Business logic
│   │   │   └── resources/   # Configuration files
```

## 👥 Team Members

- [Mehmet Oğuz Kocadere] - Frontend Developer
- [Barış Yıldız] - Backend Developer
- [Muzaffer Berke Savaş] - UI/UX Designer
- [Abdussamet Tekin] - Database Engineer
- [Said Çetin] - QA Engineer

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/400x250?text=Restaurant+Browse+Screen" alt="Restaurant Browse Screen" width="45%"/>
  <img src="https://via.placeholder.com/400x250?text=Order+Details+Screen" alt="Order Details Screen" width="45%"/>
</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
