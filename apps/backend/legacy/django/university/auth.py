from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from django.contrib.auth import get_user_model

class CustomOIDCAuthentationBackend(OIDCAuthenticationBackend):

    def create_user(self, claims):
        User = get_user_model()
        
        if User.objects.filter(username=claims.get('nmec', '')).exists():
            user = User.objects.get(username=claims.get('nmec', ''))
            return self.update_user(user, claims)

        user = super(CustomOIDCAuthentationBackend, self).create_user(claims)

        user.first_name = claims.get('given_name', '')
        user.last_name = claims.get('family_name', '').split(' ')[-1]
        user.username = claims.get('nmec', '')
        user.password = "" # User does not have password
        user.save()

        return user

    def update_user(self, user, claims):
        user.first_name = claims.get('given_name', '')
        user.last_name = claims.get('family_name', '').split(' ')[-1]
        user.save()

        return user

