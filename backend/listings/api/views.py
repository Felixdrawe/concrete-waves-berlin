from .serializers import ListingSerializer, FavoriteSerializer
from listings.models import Listing, Favorite
from rest_framework import generics


class ListingList(generics.ListAPIView):
    queryset = Listing.objects.all().order_by('-date_posted')
    serializer_class = ListingSerializer


class ListingCreate(generics.CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class ListingDetail(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class ListingUpdate(generics.UpdateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class ListingDelete(generics.DestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class FavoriteCreate(generics.CreateAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer


# View
class FavoriteDelete(generics.DestroyAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    lookup_url_kwarg = 'favorite_id'  # Add this line

    def get_queryset(self):
        listing_id = self.kwargs.get('pk')
        return Favorite.objects.filter(listing_id=listing_id)


class FavoriteList(generics.ListAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
