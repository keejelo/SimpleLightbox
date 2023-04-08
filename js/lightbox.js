/*****************************************************************************************************
// ** Simple Lightbox - original source: https://www.w3schools.com/howto/howto_js_lightbox.asp
// ** Modified by me to be more responsive, flexible, easier to setup and implement.
//
// ** Create the below thumbnail setup in your HTML, everything else will be generated by Javascript
//

<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta charset="utf-8" />
<title>Simple Lightbox demo</title>

<!-- Add the css and javascript files -->
<link type="text/css" rel="stylesheet" media="all" href="css/lightbox.css" />
<script type="text/javascript" src="js/lightbox.js"></script>

</head>
<body>

    <!-- Lightbox thumbnail setup: start -->

    <div id="lightbox-set">

        <a class="lightbox-thumbs" href="mypic1.jpg" rel="1" title="Nature">
            <img src="mypic1.jpg" />
        </a>

        <a class="lightbox-thumbs" href="mypic2.jpg" rel="2" title="City">
            <img src="mypic2.jpg" />
        </a>

        <a class="lightbox-thumbs" href="mypic3.jpg" rel="3" title="Food">
            <img src="mypic3.jpg" />
        </a>

        ... more of the same if you want..

    </div>

    <!-- Lightbox thumbnail setup: end -->

</body>
</html>
*****************************************************************************************************/

let SimpleLightbox = (function()
{
    'use strict';

    // ** Global variables
    let g_modalPaddingTop = 60;
    let g_slideIndex = 1;
    let g_log = false;

    // ** Open the Modal
    function openModal()
    {
        document.getElementById('lightbox-modal').style.display = 'block';
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    };

    // ** Close the Modal
    function closeModal()
    {
        document.getElementById('lightbox-modal').style.display = 'none';
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
    };

    // ** Next/previous controls
    function nextSlide()
    {
        let slides = document.getElementsByClassName('lightbox-modal-slides');
        let n = g_slideIndex++;
        if (n > slides.length) {g_slideIndex = 1;}
        if (n < 1) {g_slideIndex = slides.length;}
        showSlides(g_slideIndex);
    };
    function prevSlide()
    {
        let slides = document.getElementsByClassName('lightbox-modal-slides');
        let n = g_slideIndex--;
        if (n > slides.length) {g_slideIndex = 1;}
        if (n < 1) {g_slideIndex = slides.length;}
        showSlides(g_slideIndex);
    };

    // ** Thumbnail image controls
    function currentSlide(n)
    {
        showSlides(g_slideIndex = n);
    };

    // ** Work function
    function showSlides(n)
    {
        let i = 0;
        let slides = document.getElementsByClassName('lightbox-modal-slides');
        let thumbs = document.getElementsByClassName('lightbox-modal-thumbs');
        let captionText = document.getElementById('lightbox-modal-caption');

        if (n > slides.length) {g_slideIndex = 1;};
        if (n < 1) {g_slideIndex = slides.length;};

        for (i = 0; i < slides.length; i++)
        {
            slides[i].style.display = 'none';
        }

        for (i = 0; i < thumbs.length; i++)
        {
            thumbs[i].className = thumbs[i].className.replace(' active', '');
        }

        slides[g_slideIndex-1].style.display = 'block';
        thumbs[g_slideIndex-1].className += ' active';
        captionText.innerHTML = thumbs[g_slideIndex-1].title;
        captionText.innerHTML = captionText.innerHTML.replace(/\\n/g, '<br>');
        captionText.innerHTML = captionText.innerHTML.replace(/\\r\\n/g, '<br>');
    };

    // ** Create modal lightbox
    function createModal()
    {
        // ** Create the modal container
        let lightboxSet = document.getElementById('lightbox-set');

        if(lightboxSet)
        {
            let lightboxModal = '<div id="lightbox-modal" class="lightbox-modal-class">' +
                                '   <span class="lightbox-modal-close lightbox-cursor">&times;</span>' +
                                '   <div class="lightbox-modal-content">' +
                                '       <a class="lightbox-modal-prev">&#10094;</a>' +
                                '       <a class="lightbox-modal-next">&#10095;</a>' +
                                '       <div id="lightbox-modal-slides-container"></div>' +
                                '       <div class="lightbox-modal-caption-container">' +
                                '           <p id="lightbox-modal-caption"></p>' +
                                '       </div>' +
                                '       <div id="lightbox-modal-thumbs-container"></div>' +
                                '   </div>'+
                                '</div>';

            // ** Insert into element
            lightboxSet.innerHTML += lightboxModal;

            // ** Create content
            let lightboxThumbs = lightboxSet.getElementsByClassName('lightbox-thumbs');
            let lightboxSlides = document.getElementById('lightbox-modal-slides-container');
            let lightboxModalThumbs = document.getElementById('lightbox-modal-thumbs-container');

            if(lightboxThumbs[0] && lightboxSlides && lightboxModalThumbs)
            {
                for(let i = 0; i < lightboxThumbs.length;i++)
                {
                    let slideNum = lightboxThumbs[i].getAttribute('rel');
                    let slideSrc = lightboxThumbs[i].getAttribute('href');
                    let slideTitle = lightboxThumbs[i].getAttribute('title');

                    let slideThumbSrc = lightboxThumbs[i].getElementsByTagName('img')[0].getAttribute('src');

                    let div1 = document.createElement('div');
                    div1.setAttribute('class','lightbox-modal-slides');
                    lightboxSlides.appendChild(div1);

                    let div2 = document.createElement('div');
                    div2.setAttribute('class','lightbox-modal-numbertext');
                    div1.appendChild(div2);
                    div2.innerHTML = slideNum + ' / ' + lightboxThumbs.length;

                    let img1 = document.createElement('img');
                    img1.setAttribute('src', slideSrc);
                    div1.appendChild(img1);

                    let div3 = document.createElement('div');
                    if(i == lightboxThumbs.length-1)
                    {
                        div3.setAttribute('class','lightbox-modal-column-last');
                    }
                    else
                    {
                        div3.setAttribute('class','lightbox-modal-column');
                    }
                    lightboxModalThumbs.appendChild(div3);

                    let img2 = document.createElement('img');
                    img2.setAttribute('class', 'lightbox-modal-thumbs');
                    img2.setAttribute('title', slideTitle);
                    img2.setAttribute('alt', slideNum);
                    img2.setAttribute('src', slideThumbSrc);
                    div3.appendChild(img2);
                }
            }
        }
        else
        {
            if(g_log)
            {
                console.log('Error, element with class not found: "lightbox-set"');
            }
        }
    };

    // ** Window resize event function
    function onResize()
    {
        let modalPaddingTop = g_modalPaddingTop;

        let slides = document.getElementsByClassName('lightbox-modal-slides');
        let modal = document.getElementsByClassName('lightbox-modal-class');
        let caption = document.getElementsByClassName('lightbox-modal-caption-container');
        let thumbs = document.getElementById('lightbox-modal-thumbs-container');

        if(slides[0] && modal[0] && caption[0] && thumbs)
        {
            for(let i = 0; i < slides.length;i++)
            {
                if(slides[i].style.display == 'block')
                {
                    let img = slides[i].getElementsByTagName('img')[0];
                    let imgHeight = img.offsetHeight;

                    if((imgHeight + (modalPaddingTop * 2)) > window.innerHeight)
                    {
                        modal[0].style.paddingTop = '0';
                        caption[0].style.visibility = 'hidden';
                        thumbs.style.visibility = 'hidden';
                    }
                    else if((imgHeight + (modalPaddingTop * 2)) < window.innerHeight)
                    {
                        modal[0].style.paddingTop = g_modalPaddingTop + 'px';
                        caption[0].style.visibility = 'visible';
                        thumbs.style.visibility = 'visible';
                    }
                }
            }
        }
    };

    // ** Window load event
    window.addEventListener('load', function(e)
    {
        // ** Create the lightbox modal container
        createModal();

        // ** Closebutton event
        let closeButton = document.getElementsByClassName('lightbox-modal-close');
        if(closeButton[0])
        {
            closeButton[0].addEventListener('click', function()
            {
                closeModal();
            });
        }
        else
        {
            if(g_log)
            {
                console.log('Error, element with class not found: "lightbox-modal-close"');
            }
        }

        // ** Get all thumbnail elements (in "lightbox-set")
        let thumbs = document.getElementsByClassName('lightbox-thumbs');
        if(thumbs[0])
        {
            for(let i = 0; i < thumbs.length; i++)
            {
                thumbs[i].addEventListener('click', function(e)
                {
                    openModal();
                    currentSlide(thumbs[i].getAttribute('rel'));
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e.preventDefault();
                    return false;
                });
            }
        }
        else
        {
            if(g_log)
            {
                console.log('Error, element with class not found: "lightbox-thumbs"');
            }
        }

        // ** Get all thumbnail elements in modalbox
        let col = document.getElementsByClassName('lightbox-modal-column');
        if(col[0])
        {
            for(let i = 0; i < col.length; i++)
            {
                col[i].addEventListener('click', function()
                {
                    openModal();
                    currentSlide(col[i].getElementsByTagName('img')[0].getAttribute('alt'));
                });
            }
        }
        else
        {
            if(g_log)
            {
                console.log('Error, element with class not found: "lightbox-modal-column"');
            }
        }

        let col2 = document.getElementsByClassName('lightbox-modal-column-last');
        if(col2[0])
        {
            for(let i = 0; i < col2.length; i++)
            {
                col2[i].addEventListener('click', function()
                {
                    openModal();
                    currentSlide(col2[i].getElementsByTagName('img')[0].getAttribute('alt'));
                });
            }
        }
        else
        {
            if(g_log)
            {
                console.log('Error, element with class not found: "lightbox-modal-column-last"');
            }
        }

        // ** Previous button event
        let prev = document.getElementsByClassName('lightbox-modal-prev');
        if(prev[0])
        {
            prev[0].addEventListener('click', function()
            {
                prevSlide();
            });
        }
        else
        {
            if(g_log)
            {
                console.log('Error, element with class not found: "lightbox-modal-prev"');
            }
        }

        // ** Next button event
        let next = document.getElementsByClassName('lightbox-modal-next');
        if(next[0])
        {
            next[0].addEventListener('click', function()
            {
                nextSlide();
            });
        }
        else
        {
            if(g_log)
            {
                console.log('Error, element with class not found: "lightbox-modal-next"');
            }
        }

        // ** Get key press events
        document.addEventListener('keyup', function(e)
        {
            let keyName = e.key;
            let keyCode = e.code;

            if(keyName == 'ArrowRight' || keyCode == 'ArrowRight')
            {
                nextSlide();
            }
            else if(keyName == 'ArrowLeft' || keyCode == 'ArrowLeft')
            {
                prevSlide();
            }
            else if(keyName == 'Escape' || keyCode == 'Escape')
            {
                closeModal();
            }
            else if(keyName.toLowerCase() == 'x' || keyCode.toLowerCase() == 'x')
            {
                closeModal();
            }
        });

        // ** Window resize event
        window.addEventListener('resize', function()
        {
            onResize();
        });

        // ** Run once on initial load
        onResize();
    });

    return {};
})();
