from rest_framework import serializers
from users.models import Profile
from listings.models import Listing
from listings.api.serializers import ListingSerializer


class ProfileSerializer(serializers.ModelSerializer):
    profile_listings = serializers.SerializerMethodField()

    def get_profile_listings(self, obj):
        query = Listing.objects.filter(profile=obj.profile)
        listings_serialized = ListingSerializer(query, many=True)
        return listings_serialized.data

    class Meta:
        model = Profile
        fields = '__all__'



