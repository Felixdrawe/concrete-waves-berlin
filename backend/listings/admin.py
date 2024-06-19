from django.contrib import admin
from listings.models import Listing, Favorite




# Register the Listing model with the ListingAdmin
admin.site.register(Listing)
admin.site.register(Favorite)
