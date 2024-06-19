from rest_framework import serializers
from listings.models import Listing, Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'listing']


class ListingSerializer(serializers.ModelSerializer):
    profile_username = serializers.SerializerMethodField()
    profile_profile_name = serializers.SerializerMethodField()
    favorites = serializers.SerializerMethodField()

    def get_profile_username(self, obj):
        return obj.profile.username

    def get_profile_profile_name(self, obj):
        return obj.profile.profile.profile_name

    def get_favorites(self, obj):
        favorites = Favorite.objects.filter(listing=obj)
        return FavoriteSerializer(favorites, many=True).data

    class Meta:
        model = Listing
        fields = '__all__'


