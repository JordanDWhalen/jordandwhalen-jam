const cl = new cloudinary.Cloudinary({cloud_name: "jordandwhalen", secure: true});
const cloudinary_url = "https://res.cloudinary.com/jordandwhalen/";
const cloudinary_fetch_url = cloudinary_url + "/image/fetch/";

$(function() {

  jribbble.shots({token: "7d01edbdb6f82ab8894c9e237dae8f82caadf95b6b27621b151c986cebe40bd3"}, function(shotsArray) {

    shotsArray.reduce(function(html, shot) {

      $('.dribbble').append(
        '<a class="dribbble__item" href="' + shot.html_url + '">' +
          '<img class="dribbble__item-image" src="' + cloudinary_fetch_url + shot.images.normal + '"/>' +
        '<a/>');

    }, "");

  });

});

