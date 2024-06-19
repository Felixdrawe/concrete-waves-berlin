from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
User = get_user_model()




class Listing(models.Model):
    profile = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)

    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    choices_spot = (
        ('Flat', 'Flat'),
        ('Skatepark', 'Skatepark'),
        ('Pumptrack', 'Pumptrack'),
        ('Bowl', 'Bowl'),
    )
    spot_type = models.CharField(max_length=20, choices=choices_spot, blank=True,
                                 null=True)

    conditions_spot = (
        ('Very Good', 'Very Good'),
        ('Good', 'Good'),
        ('Average', 'Average'),
        ('Poor', 'Poor'),
    )
    conditions = models.CharField(max_length=20, choices=conditions_spot, blank=True,
                                  null=True)

    beginner = models.BooleanField(default=False, blank=True, null=True)
    intermediate = models.BooleanField(default=False, blank=True, null=True)
    pro = models.BooleanField(default=False, blank=True, null=True)


    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    picture1 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/")
    picture2 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/")
    picture3 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/")
    picture4 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/")
    picture5 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/")

    date_posted = models.DateTimeField(default=timezone.now)
    

    def __str__(self):
        return self.title

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'listing')