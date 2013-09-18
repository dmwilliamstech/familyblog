from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django_blog import *
#from blog.feeds import BlogFeedAll, BlogFeedBlog, BlogFeedUser
from django.contrib import admin
admin.autodiscover()

#blogs_feed_dict = {'feed_dict':{ 'all': BlogFeedAll, 'blog' : BlogFeedBlog, 'only': BlogFeedUser,}}
urlpatterns = patterns("",
    url(r"^$", TemplateView.as_view(template_name="home.html"), name="home"),
    url(r"^admin/", include(admin.site.urls)),
    url(r"^account/", include("account.urls")),
    url(r"^weblog/", include("zinnia.urls")),
#    url(r"^blog/author/", include("django_blog.urls.authors")),
    url(r"comments/", include("django.contrib.comments.urls")),
#    url(r"^blog/category", include("django_blog.urls.categories")),
   # url(r"^blog/", include('django_blog.urls.entries')),
)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
