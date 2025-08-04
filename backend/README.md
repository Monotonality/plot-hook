# Plot Hook Backend

Django REST API backend for the Plot Hook D&D world-building tool.

## Setup

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Run development server**
   ```bash
   python manage.py runserver
   ```

## Project Structure

- `plot_hook_api/` - Main Django project
- `books/` - Categories and Entries for all three books
- `users/` - User authentication and role management
- `sessions/` - Campaign sessions and story progression

## API Endpoints

- `/api/books/` - Categories and entries management
- `/api/users/` - User authentication and management
- `/api/sessions/` - Campaign session management 