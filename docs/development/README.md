# Development Guide

This guide is for developers contributing to the Plot Hook project.

## Project Overview

Plot Hook is a Django + React application with the following architecture:

- **Backend**: Django REST API with PostgreSQL
- **Frontend**: React single-page application
- **Database**: PostgreSQL for data persistence

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
# Edit .env with your database credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Project Structure

### Backend (Django)
```
backend/
├── plot_hook_api/     # Main Django project
├── books/            # Categories and entries
├── users/            # Authentication and user management
├── sessions/         # Campaign session management
└── requirements.txt  # Python dependencies
```

### Frontend (React)
```
frontend/src/
├── components/       # Reusable UI components
├── pages/           # Main application pages
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── context/         # React context providers
```

## Code Style

### Python (Backend)
- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings to all functions and classes
- Maximum line length: 88 characters (Black formatter)

### JavaScript (Frontend)
- Use ES6+ features
- Follow React best practices
- Use meaningful component and variable names
- Maximum line length: 80 characters

## Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Database Migrations

When making model changes:
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## API Development

### Creating New Endpoints
1. Define models in the appropriate app
2. Create serializers for data transformation
3. Create views for business logic
4. Add URL patterns
5. Write tests

### Example Endpoint
```python
# models.py
class Category(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    book_type = models.CharField(max_length=20, choices=BOOK_TYPES)

# serializers.py
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# views.py
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
```

## Contributing

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

### Commit Messages
Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests

## Deployment

### Backend Deployment
- Use environment variables for configuration
- Set DEBUG=False in production
- Configure PostgreSQL connection
- Set up static file serving

### Frontend Deployment
- Build the application: `npm run build`
- Serve static files from a web server
- Configure API endpoint URLs

## Troubleshooting

### Common Issues
1. **Database connection errors**: Check PostgreSQL is running
2. **CORS errors**: Verify CORS settings in Django
3. **JWT token issues**: Check token expiration settings
4. **React build errors**: Clear node_modules and reinstall

### Getting Help
- Check the existing documentation
- Search existing issues
- Create a new issue with detailed information 