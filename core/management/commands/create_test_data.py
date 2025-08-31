from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import World, Category


class Command(BaseCommand):
    help = 'Create test data for development'

    def handle(self, *args, **options):
        # Create a test user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Created test user: {user.username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Test user already exists: {user.username}')
            )

        # Create a test world
        world, created = World.objects.get_or_create(
            name='Aevareth',
            defaults={
                'owner': user,
                'description': 'A mystical realm of ancient magic and forgotten kingdoms',
                'theme_color': '#8b7355',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Created test world: {world.name} (slug: {world.slug})')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Test world already exists: {world.name} (slug: {world.slug})')
            )

        # Create some test categories
        categories_data = [
            {
                'name': 'History',
                'description': 'The ancient chronicles of Aevareth',
                'parent': None
            },
            {
                'name': 'Geography',
                'description': 'Maps and locations of the realm',
                'parent': None
            },
            {
                'name': 'First Great War',
                'description': 'The legendary conflict that shaped the realm',
                'parent': 'History'
            },
            {
                'name': 'John The Hero',
                'description': 'The legendary warrior who ended the First Great War',
                'parent': 'First Great War'
            }
        ]

        created_categories = []
        for cat_data in categories_data:
            parent_name = cat_data.pop('parent')
            parent = None
            if parent_name:
                parent = next((c for c in created_categories if c.name == parent_name), None)
            
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                world=world,
                parent=parent,
                defaults=cat_data
            )
            
            if created:
                created_categories.append(category)
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {category.name} (slug: {category.slug})')
                )
            else:
                created_categories.append(category)
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category.name} (slug: {category.slug})')
                )

        self.stdout.write(
            self.style.SUCCESS('\nTest data created successfully!')
        )
        self.stdout.write(
            self.style.SUCCESS(f'Login with: username=testuser, password=testpass123')
        )
        self.stdout.write(
            self.style.SUCCESS(f'Test URL: http://localhost:8000/aevareth/')
        )
